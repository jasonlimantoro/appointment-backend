import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { Auth } from 'aws-amplify';
import { createTestClientAndServer } from '../utils';
import mockUser from '../../fixtures/users';

jest.mock('jsonwebtoken');
jest.mock('aws-amplify');
jest.mock('uuid');

describe('Authentication', () => {
  it('login: should work', async () => {
    const decoded = {
      sub: 'uuid-user',
    };
    const mockCognito = {
      signInUserSession: {
        idToken: {
          jwtToken: 'some-token',
        },
      },
    };
    const { mutate, authAPI, sessionAPI } = createTestClientAndServer();
    Auth.signIn = jest.fn().mockResolvedValue(mockCognito);
    uuid.v1 = jest.fn().mockReturnValue('some-unique-id');
    jwt.decode = jest.fn().mockReturnValue(decoded);
    const spiedLogin = jest.spyOn(authAPI, 'login');
    const spiedSessionCreation = jest.spyOn(sessionAPI, 'create');
    const spiedEncryption = jest.spyOn(Buffer, 'from');
    const LOGIN = gql`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
          session {
            id
          }
        }
      }
    `;
    const res = await mutate({ mutation: LOGIN, variables: mockUser });
    expect(res).toMatchSnapshot();
    expect(spiedEncryption).toBeCalledWith('some-unique-id');
    expect(spiedLogin).toBeCalledWith(mockUser);
    expect(jwt.decode).toBeCalledWith(
      mockCognito.signInUserSession.idToken.jwtToken,
    );
    expect(spiedSessionCreation).toBeCalledWith({ userId: decoded.sub });
  });

  it('logout: should work', async () => {
    const { mutate, sessionAPI } = createTestClientAndServer();
    const spyEndSession = jest.spyOn(sessionAPI, 'end');
    const LOGOUT = gql`
      mutation Logout($sessionId: String!) {
        logout(sessionId: $sessionId)
      }
    `;
    const res = await mutate({
      mutation: LOGOUT,
      variables: { sessionId: 'some-session-id' },
    });
    expect(res).toMatchSnapshot();
    expect(spyEndSession).toBeCalledWith({
      id: Buffer.from('some-session-id', 'base64').toString('ascii'),
    });
  });

  it('should return false when logout fails', async () => {
    const { mutate, sessionAPI } = createTestClientAndServer();
    sessionAPI.end = jest.fn().mockResolvedValue(false);
    const LOGOUT = gql`
      mutation Logout($sessionId: String!) {
        logout(sessionId: $sessionId)
      }
    `;
    const res = await mutate({
      mutation: LOGOUT,
      variables: { sessionId: 'some-session-id' },
    });
    expect(res.data.logout).toEqual(false);
  });
});
