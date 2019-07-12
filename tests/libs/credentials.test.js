import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import * as credentialUtils from '../../libs/credentials';

AWSMock.setSDKInstance(AWS);

const mockCredentials = {
  AccessKeyId: 'access-key',
  SecretAccessKey: 'secret-access',
  SessionToken: 'session-token',
};
const mockServiceReplacer = jest.fn();
beforeEach(() => {
  mockServiceReplacer.mockImplementation((params, callback) => {
    callback(null, { Credentials: mockCredentials });
  });
  AWSMock.mock('STS', 'assumeRole', mockServiceReplacer);
});

describe('Credentials', () => {
  describe('getServiceWithAsssumedCredentials', () => {
    it('should work', async () => {
      const user = {
        'cognito:roles': ['admin'],
      };
      const replacer = jest.fn().mockReturnValue(true);
      await credentialUtils.getServiceWithAssumedCredentials(
        user,
        'DynamoDB.DocumentClient',
        replacer,
        'proxyRole',
      );
      expect(mockServiceReplacer.mock.calls[0][0]).toEqual({
        RoleArn: user['cognito:roles'][0],
        RoleSessionName: 'proxyRole',
      });
      expect(replacer).toBeCalledTimes(1);
      const call = replacer.mock.calls[0][0];
      expect(call).toBeInstanceOf(AWS.DynamoDB.DocumentClient);
      expect(call.options).toMatchObject(
        expect.objectContaining({
          accessKeyId: mockCredentials.AccessKeyId,
          secretAccessKey: mockCredentials.SecretAccessKey,
          sessionToken: mockCredentials.SessionToken,
        }),
      );
    });
  });
});
