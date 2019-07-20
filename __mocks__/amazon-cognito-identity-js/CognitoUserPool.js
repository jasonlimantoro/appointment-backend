export default class CognitoUserPool {
  constructor(data = {}) {
    const { UserPoolId, ClientId } = data;
    this.userPoolId = UserPoolId;
    this.clientId = ClientId;
  }

  getCurrentUser = jest.fn().mockReturnValue('cognitouserpool');
}
