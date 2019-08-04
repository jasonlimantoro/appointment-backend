import CustomAuth from '../../libs/auth';

describe('Auth', () => {
  it('refreshToken: should work', async () => {
    await CustomAuth.login({
      username: 'dummy-username',
      password: 'dummy-password',
    });
    const res = await CustomAuth.refresh({ cognitoUsername: 'dummy-username' });
    expect(res).toMatchSnapshot();
  });
});
