import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import CustomAuth from '../../libs/auth';
import { AuthService } from '../../services';
import mockUser from '../../fixtures/users';

AWSMock.setSDKInstance(AWS);

const service = new AuthService();

beforeEach(() => {
  AWSMock.mock('CognitoIdentityCredentials', 'refreshPromise', () => {});
});

describe('Auth Service', () => {
  it('login: should get the token', async () => {
    const CognitoUser = {
      idToken: {
        jwtToken: 'some-token',
      },
    };
    CustomAuth.login = jest.fn().mockResolvedValue(CognitoUser);

    const res = await service.login(mockUser);
    expect(CustomAuth.login).toBeCalledWith({
      username: mockUser.username,
      password: mockUser.password,
    });

    expect(res).toEqual('some-token');
  });
});
