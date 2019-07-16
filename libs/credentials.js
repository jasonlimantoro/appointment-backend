import AWS from 'aws-sdk';
import get from 'lodash/get';
import * as helpers from './helpers';

export const getServiceWithAssumedCredentials = async (
  user,
  Service,
  replacerFn,
  sessionName = 'proxiedCognitoRole',
) => {
  const sts = new AWS.STS();
  const role = helpers.selfOrFirstInArray(user['cognito:roles']);
  try {
    const { Credentials } = await sts
      .assumeRole({ RoleArn: role, RoleSessionName: sessionName })
      .promise();
    const ResolvedService = get(AWS, Service);
    const replacedService = new ResolvedService({
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      ...(process.env.IS_OFFLINE
        && Service.indexOf('DynamoDB') !== -1 && {
        endpoint: 'http://localhost:8000',
        region: 'localhost',
      }),
    });
    if (typeof replacerFn === 'function') {
      replacerFn(replacedService);
      return;
    }
    return replacedService;
  } catch (e) {
    throw e;
  }
};
