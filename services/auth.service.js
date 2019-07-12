import Auth from '@aws-amplify/auth';
import fs from 'fs';
import { getNestedObjectValue } from 'appointment-common';
import config from '../config/aws-exports';
import { AuthenticationError } from '../libs/errors';
import { updateLoginConfig } from '../libs/credentials';

class AuthService {
  static getJWTFromCognitoUser = CognitoUser => getNestedObjectValue(CognitoUser)([
    'signInUserSession',
    'idToken',
    'jwtToken',
  ]);

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
      await updateLoginConfig({
        [config.providerName]: token,
      });
      return token;
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  };

  logout = async () => {
    await Auth.signOut();
    await updateLoginConfig(undefined);
  };
}

export default AuthService;
