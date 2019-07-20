import jose from 'node-jose';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import config, { userPool } from '../config/aws-exports';
import {
  TokenNotIssuedError,
  PublicKeyNotFoundError,
  ApolloTokenExpiredError,
} from './errors';

class Auth {
  static cognitoUser = null;

  static verifyJwt = async token => {
    const sections = token.split('.');
    // get the kid from the headers prior to verification
    let header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    const { kid } = header;
    // download the public keys
    const response = await fetch(config.publicKeysUrl);
    const body = await response.json();
    const { keys } = body;
    // search for the kid in the downloaded public keys
    const correctKey = keys.find(k => k.kid === kid);
    if (!correctKey) {
      throw new PublicKeyNotFoundError();
    }
    // construct the public key
    const toVerify = await jose.JWK.asKey(correctKey);
    // verify the signature
    const verified = await jose.JWS.createVerify(toVerify).verify(token);
    const claims = JSON.parse(verified.payload);
    // additionally we can verify the token expiration
    const currentTs = Math.floor(new Date() / 1000);
    if (currentTs > claims.exp) {
      throw new ApolloTokenExpiredError({
        data: { name: 'TokenExpiredError', claims },
      });
    }
    // and the Audience (use claims.client_id if verifying an access token)
    if (claims.aud !== config.Auth.userPoolWebClientId) {
      throw new TokenNotIssuedError();
    }
    return claims;
  };

  static authenticatePromise = ({ authenticationDetails, cognitoUser } = {}) => new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => resolve(result),
      onFailure: err => reject(err),
    });
  });

  static getSessionPromise = () => new Promise((resolve, reject) => {
    this.cognitoUser.getSession((err, session) => {
      if (err) reject(err);
      resolve(session);
    });
  });

  static refreshSessionPromise = ({ refreshToken } = {}) => new Promise((resolve, reject) => {
    this.cognitoUser.refreshSession(refreshToken, (err, session) => {
      if (err) reject(err);
      resolve(session);
    });
  });

  static login = async ({ username, password } = {}) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
    const user = await this.authenticatePromise({
      authenticationDetails,
      cognitoUser,
    });
    this.cognitoUser = cognitoUser;
    return user;
  };

  /**
   * @todo: fix issue where cognitoUser is always null
   */
  static logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    cognitoUser.globalSignOut({
      onSuccess: res => console.log(res),
      onFailure: err => console.log(err),
    });
  };

  static refresh = async claim => {
    const userData = {
      Username: claim['cognito:username'] || claim.cognitoUsername,
      Pool: userPool,
    };
    this.cognitoUser = new CognitoUser(userData);
    const session = await this.getSessionPromise();
    const refreshToken = session.getRefreshToken();
    const refreshedSession = await this.refreshSessionPromise({
      userData,
      refreshToken,
    });
    return refreshedSession;
  };
}

export default Auth;
