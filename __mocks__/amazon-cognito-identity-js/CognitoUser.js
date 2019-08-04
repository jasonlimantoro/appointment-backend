import CognitoUserSession from './CognitoUserSession';

export default class CognitoUser {
  constructor(userData = {}) {
    const { Username, Pool } = userData;
    this.username = Username;
    this.pool = Pool;
  }

  getSession = jest
    .fn()
    .mockImplementation(cb => cb(null, new CognitoUserSession()));

  authenticateUser = jest
    .fn()
    .mockImplementation((authDetails, { onSuccess }) => onSuccess({}));

  refreshSession = jest
    .fn()
    .mockImplementation((_refreshToken, cb) =>
      cb(null, new CognitoUserSession()));
}
