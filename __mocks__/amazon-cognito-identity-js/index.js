import CognitoUser from './CognitoUser';
import CognitoUserPool from './CognitoUserPool';
import AuthenticationDetails from './AuthenticationDetails';

module.exports = {
  CognitoUserPool: jest.fn().mockImplementation(() => new CognitoUserPool()),
  CognitoUser: jest.fn().mockImplementation(() => new CognitoUser()),
  AuthenticationDetails: jest
    .fn()
    .mockImplementation(() => new AuthenticationDetails()),
};
