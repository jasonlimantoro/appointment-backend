import { Auth } from 'aws-amplify';
import fs from 'fs';
import BaseService from './base';
import { AuthenticationError } from '../libs/errors';

class AuthService extends BaseService {
  static getJWTFromCognitoUser = CognitoUser => CognitoUser.signInUserSession.idToken.jwtToken;

  login = async ({ username, password }) => {
    try {
      const res = await Auth.signIn(username, password);
      if (process.env.NODE_ENV !== 'production') {
        fs.writeFileSync('./fixtures/cognito-user.json', JSON.stringify(res));
      }
      return this.constructor.getJWTFromCognitoUser(res);
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  };
}

export default AuthService;
