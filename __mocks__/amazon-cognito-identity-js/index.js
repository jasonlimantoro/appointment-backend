import CognitoUser from './CognitoUser';
import CognitoUserPool from './CognitoUserPool';

module.exports = {
  CognitoUserPool: jest.fn().mockImplementation(() => new CognitoUserPool()),
  CognitoUser: jest.fn().mockImplementation(() => new CognitoUser()),
};
