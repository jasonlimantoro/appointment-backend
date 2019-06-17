import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import { createTestClientAndServer } from '../utils';
import mockUser from '../../fixtures/users';

jest.mock('jsonwebtoken');

describe('Authentication', () => {
  it('login: should work', async () => {
    const decoded = {
      sub: 'uuid-user',
    };
    const { mutate, authAPI, sessionAPI } = createTestClientAndServer();
    authAPI.login = jest.fn().mockResolvedValue('some-random-token');
    jwt.decode = jest.fn().mockReturnValue(decoded);
    sessionAPI.create = jest.fn();
    const LOGIN = gql`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password)
      }
    `;
    const res = await mutate({ mutation: LOGIN, variables: mockUser });
    expect(res).toMatchSnapshot();
    expect(authAPI.login).toBeCalledWith(mockUser);
    expect(jwt.decode).toBeCalledWith('some-random-token');
    expect(sessionAPI.create).toBeCalledWith({ userId: decoded.sub });
  });
});
