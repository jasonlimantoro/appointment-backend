import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import fs from 'fs';
import { getNestedObjectValue } from 'appointment-common';
import config from '../config/aws-exports';
import { AuthenticationError } from '../libs/errors';

class AuthService {
  static getJWTFromCognitoUser = CognitoUser => getNestedObjectValue(CognitoUser)([
    'signInUserSession',
    'idToken',
    'jwtToken',
  ]);

  updateConfig = token => {
    AWS.config.credentials.params.Logins = AWS.config.credentials.params.Logins || {};
    AWS.config.credentials.params.Logins[config.providerName] = token;
    AWS.config.credentials.expired = true;
  };

  login = async ({ username, password }) => {
    try {
      const res = await Auth.signIn(username, password);
      if (process.env.NODE_ENV === 'development') {
        fs.writeFileSync(
          './fixtures/cognito-user.json',
          JSON.stringify(res, null, 2),
        );
      }
      const token = this.constructor.getJWTFromCognitoUser(res);
      this.updateConfig(token);
      return token;
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  };

  logout = () => {
    AWS.config.credentials.params.Logins = undefined;
  };
}

export default AuthService;
