import jose from 'node-jose';
import AWSConfiguration from '../config/aws-exports';
import {
  TokenExpiredError,
  TokenNotIssuedError,
  PublicKeyNotFoundError,
} from './errors';

const keysUrl = `https://cognito-idp.${
  AWSConfiguration.Auth.region
}.amazonaws.com/${AWSConfiguration.Auth.userPoolId}/.well-known/jwks.json`;

class Auth {
  // eslint-disable-next-line class-methods-use-this
  static verifyJwt = async token => {
    const sections = token.split('.');
    // get the kid from the headers prior to verification
    let header = jose.util.base64url.decode(sections[0]);
    header = JSON.parse(header);
    const { kid } = header;
    // download the public keys
    const response = await fetch(keysUrl);
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
      throw new TokenExpiredError();
    }
    // and the Audience (use claims.client_id if verifying an access token)
    if (claims.aud !== AWSConfiguration.Auth.userPoolWebClientId) {
      throw new TokenNotIssuedError();
    }
    return claims;
  };
}

export default Auth;
