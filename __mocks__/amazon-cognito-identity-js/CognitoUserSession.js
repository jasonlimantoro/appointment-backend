export default class CognitoUserSession {
  constructor(data = {}) {
    const {
      RefreshToken = 'dummy-refreshToken',
      AccessToken = 'dummy-accessToken',
      IdToken = 'dummy-idToken',
    } = data;
    this.refreshToken = RefreshToken;
    this.accessToken = AccessToken;
    this.idToken = IdToken;
  }

  getRefreshToken = jest.fn().mockReturnValue(this.refreshToken);
}
