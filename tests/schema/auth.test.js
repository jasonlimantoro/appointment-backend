import gql from 'graphql-tag';
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import Auth from '@aws-amplify/auth';
import { createTestClientAndServer } from '../utils';
import mockUser from '../../fixtures/users';
import * as credentialUtils from '../../libs/credentials';
import CustomAuth from '../../libs/auth';

AWS.config.credentials = {
  params: {
    Logins: {},
  },
};
const spiedJwtVerification = jest.spyOn(CustomAuth, 'verifyJwt');

jest.mock('@aws-amplify/auth');
beforeEach(() => {
  credentialUtils.getServiceWithAssumedCredentials = jest
    .fn()
    .mockResolvedValue(true);
  spiedJwtVerification.mockRejectedValue(
    new Error('Authenticated routes should be protected'),
  );
});
afterEach(() => {
  spiedJwtVerification.mockClear();
});

describe('Authentication', () => {
  it('login: should work', async () => {
    const decoded = {
      sub: 'uuid-user',
    };
    const mockCognito = {
      idToken: {
        jwtToken: 'some-token',
      },
    };
    const { mutate, authAPI, sessionAPI } = createTestClientAndServer();
    CustomAuth.login = jest.fn().mockResolvedValue(mockCognito);
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
    const res = await mutate({ mutation: LOGIN, variables: mockUser[0] });
    expect(res).toMatchSnapshot();
    expect(spiedEncryption).toBeCalledWith('some-unique-id');
    expect(spiedLogin).toBeCalledWith(mockUser[0]);
    expect(jwt.decode).toBeCalledWith(mockCognito.idToken.jwtToken);
    expect(spiedSessionCreation).toBeCalledWith({ userId: decoded.sub });
  });

  it('logout: should work', async () => {
    const { mutate, sessionAPI } = createTestClientAndServer();
    const loginSession = await sessionAPI.create({ userId: 'some-user-id' });
    const spyEndSession = jest.spyOn(sessionAPI, 'end');
    const LOGOUT = gql`
      mutation Logout($sessionId: String!) {
        logout(sessionId: $sessionId)
      }
    `;
    const encryptedSessionId = Buffer.from(loginSession.id).toString('base64');
    spiedJwtVerification.mockResolvedValue(true);
    const res = await mutate({
      mutation: LOGOUT,
      variables: {
        sessionId: encryptedSessionId,
      },
    });
    expect(res).toMatchSnapshot();
    expect(spyEndSession).toBeCalledWith({
      id: Buffer.from(encryptedSessionId, 'base64').toString('ascii'),
    });
  });

  it('should handle error when logout fails', async () => {
    const { mutate, sessionAPI } = createTestClientAndServer();
    sessionAPI.end = jest.fn().mockRejectedValue(false);
    const LOGOUT = gql`
      mutation Logout($sessionId: String!) {
        logout(sessionId: $sessionId)
      }
    `;
    Auth.signOut = jest.fn().mockResolvedValue(true);
    spiedJwtVerification.mockResolvedValue(true);
    const res = await mutate({
      mutation: LOGOUT,
      variables: { sessionId: 'some-session-id' },
    });
    expect(res).toMatchSnapshot();
  });
});
