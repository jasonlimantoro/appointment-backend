import gql from 'graphql-tag';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { createTestClientAndServer, truncateDb } from '../utils';
import models from '../../database/models';
import mockUser from '../../fixtures/users';
import * as credentialUtils from '../../libs/credentials';
import CustomAuth from '../../libs/auth';

AWSMock.setSDKInstance(AWS);

const spiedJwtVerification = jest.spyOn(CustomAuth, 'verifyJwt');

beforeEach(async () => {
  await truncateDb();
  AWSMock.mock('CognitoIdentityCredentials', 'refreshPromise', () => {});
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

afterAll(async () => {
  await models.sequelize.close();
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
    const { mutate } = createTestClientAndServer();
    const { session } = models;
    const allSession = () => session.findAll();
    CustomAuth.login = jest.fn().mockResolvedValue(mockCognito);
    uuid.v1 = jest.fn().mockReturnValue('some-unique-id');
    jwt.decode = jest.fn().mockReturnValue(decoded);
    // const spiedLogin = jest.spyOn(authAPI, 'login');
    // const spiedSessionCreation = jest.spyOn(sessionAPI, 'create');
    // const spiedEncryption = jest.spyOn(Buffer, 'from');
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
    expect(await allSession()).toHaveLength(0);
    const res = await mutate({ mutation: LOGIN, variables: mockUser[0] });
    expect(res.errors).toBeUndefined();
    expect(await allSession()).toHaveLength(1);
    const sessionId = (await allSession())[0].getDataValue('id');

    expect(res.data.login.token).toEqual(mockCognito.idToken.jwtToken);
    expect(res.data.login.session.id).toEqual(
      Buffer.from(sessionId).toString('base64'),
    );
    expect(jwt.decode).toBeCalledWith(mockCognito.idToken.jwtToken);
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
    spiedJwtVerification.mockResolvedValue(true);
    const res = await mutate({
      mutation: LOGOUT,
      variables: { sessionId: 'some-session-id' },
    });
    expect(res).toMatchSnapshot();
  });

  it('refreshToken: should work', async () => {
    const { query, authAPI } = createTestClientAndServer();
    const REFRESH = gql`
      query RefreshToken($cognitoUsername: String!) {
        refreshToken(cognitoUsername: $cognitoUsername) {
          token
        }
      }
    `;
    authAPI.refresh = jest.fn().mockResolvedValue('refresh-token');
    const res = await query({
      query: REFRESH,
      variables: { cognitoUsername: 'some-username' },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.refreshToken.token).toEqual('refresh-token');
  });
});
