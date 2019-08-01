import AWS from 'aws-sdk';
import { getNestedObjectValue } from 'appointment-common';
import config from '../config/aws-exports';
import { AuthenticationError } from '../libs/errors';
import CustomAuth from '../libs/auth';

class AuthService {
  static getJWTFromCognitoUser = CognitoUser => getNestedObjectValue(CognitoUser)(['idToken', 'jwtToken']);

  login = async ({ username, password }) => {
    try {
      const res = await CustomAuth.login({ username, password });
      const token = this.constructor.getJWTFromCognitoUser(res);
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.Auth.identityPoolId,
        Logins: {
          [config.providerName]: token,
        },
      });
      AWS.config.region = config.Auth.region;
      AWS.config.credentials = credentials;
      await AWS.config.credentials.refreshPromise();
      return token;
    } catch (e) {
      throw new AuthenticationError(e.message);
    }
  };

  logout = async () => {
    await CustomAuth.logout();
    delete AWS.config.credentials.params.Logins;
  };

  refresh = async cognitoUsername => {
    const session = await CustomAuth.refresh({ cognitoUsername });
    const refreshedToken = session.getIdToken().getJwtToken();
    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: config.Auth.identityPoolId,
      Logins: {
        [config.providerName]: refreshedToken,
      },
    });
    AWS.config.update({ credentials });
    AWS.config.credentials.refreshPromise();
    return refreshedToken;
  };
}

export default AuthService;
