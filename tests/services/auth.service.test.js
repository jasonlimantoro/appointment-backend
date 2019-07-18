import AWS from 'aws-sdk';
import CustomAuth from '../../libs/auth';
import { AuthService } from '../../services';
import mockUser from '../../fixtures/users';

jest.mock('@aws-amplify/auth');

const service = new AuthService();
AWS.config.credentials = {
  params: {
    Logins: {},
  },
};

describe('Auth Service', () => {
  it('login: should get the token', async () => {
    const CognitoUser = {
      idToken: {
        jwtToken: 'some-token',
      },
    };
    CustomAuth.login = jest.fn().mockResolvedValue(CognitoUser);

    const res = await service.login(mockUser);
    // Sign in using amplify
    expect(CustomAuth.login).toBeCalledWith({
      username: mockUser.username,
      password: mockUser.password,
    });

    expect(res).toEqual('some-token');
  });
});
