import { CognitoUser } from 'amazon-cognito-identity-js';
import CustomAuth from '../../libs/auth';

describe('Auth', () => {
  it('refreshToken: should work', async () => {
    const res = await CustomAuth.refresh({ cognitoUsername: 'dummy-username' });
    expect(CognitoUser).toBeCalledWith(
      expect.objectContaining({ Username: 'dummy-username' }),
    );
    expect(CognitoUser).toBeCalledTimes(1);
    expect(res).toMatchSnapshot();
  });
});
