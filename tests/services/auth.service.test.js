import { Auth } from 'aws-amplify';
import AuthService from '../../services/auth.service';
import mockUser from '../../fixtures/users';

jest.mock('aws-amplify');

const service = new AuthService();

describe('Auth Service', () => {
  it('login: should get the token', async () => {
    const CognitoUser = {
      signInUserSession: {
        idToken: {
          jwtToken: 'some-token',
        },
      },
    };
    Auth.signIn = jest.fn().mockResolvedValue(CognitoUser);
    const JWTSelector = jest.spyOn(AuthService, 'getJWTFromCognitoUser');

    const res = await service.login(mockUser);
    // Sign in using amplify
    expect(Auth.signIn).toBeCalledWith(mockUser.username, mockUser.password);

    // check the jwt selector
    expect(JWTSelector)
      .toBeCalledWith(CognitoUser)
      .toReturnWith('some-token');
    expect(res).toEqual('some-token');
  });
});
