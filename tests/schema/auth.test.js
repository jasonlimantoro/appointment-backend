import gql from 'graphql-tag';
import { createTestClientAndServer } from '../utils';
import mockUser from '../../fixtures/users';

describe('Authentication', () => {
  it('login: should work', async () => {
    const { mutate, authAPI } = createTestClientAndServer();
    authAPI.login = jest.fn().mockResolvedValue('some-random-token');
    const LOGIN = gql`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password)
      }
    `;
    const res = await mutate({ mutation: LOGIN, variables: mockUser });
    expect(authAPI.login).toBeCalledWith(mockUser);
    expect(res).toMatchSnapshot();
  });
});
