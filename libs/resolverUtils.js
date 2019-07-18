import moment from 'moment';
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import mime from 'mime-types';
import { getNestedObjectValue } from 'appointment-common';
import CustomAuth from './auth';
import { getServiceWithAssumedCredentials } from './credentials';
import {
  AuthenticationError,
  AuthorizationError,
  ApolloTokenExpiredError,
} from './errors';
import { transformObjectKeysToLower } from './helpers';
import { humanFormat } from './datetime';
import config from '../config/aws-exports';

/**
 * Authenticates request using the JWT token in the header
 * @param {object} context the context object sent
 * @param {function} controller the function to be executed if authentication is successful
 * @param {function} replacerCb the function to replace AWS service with updated credentials
 * @param {String} AWSService the service
 * @param  {...any} params arguments for the controller function
 */
export const checkAuthentication = async (
  context,
  controller,
  AWSService,
  replacerCb,
  ...params
) => {
  context.headers = transformObjectKeysToLower(context.headers);
  const authorization = getNestedObjectValue(context)([
    'headers',
    'authorization',
  ]);
  if (!authorization) {
    throw new AuthenticationError(
      `Provided header is invalid: ${JSON.stringify(context.headers, null, 2)}`,
    );
  }
  const token = authorization.split(' ')[1];
  try {
    const user = await CustomAuth.verifyJwt(token);
    if (!user) throw new AuthenticationError();
    if (replacerCb && AWSService) {
      await getServiceWithAssumedCredentials(user, AWSService, replacerCb);
    }
    return controller.apply(this, [...params, user, context]);
  } catch (e) {
    // eslint-disable-next-line
    console.log(`Received Header: ${JSON.stringify(context.headers, null, 2)}`);
    if (e instanceof ApolloTokenExpiredError) {
      const claim = e.data.claims;
      const session = await CustomAuth.refresh(claim);
      const refreshedToken = session.getIdToken().getJwtToken();
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: config.Auth.identityPoolId,
        Logins: {
          [config.providerName]: refreshedToken,
        },
      });
      AWS.config.update({ credentials });
      AWS.config.credentials.refreshPromise();
      context.headers.authorization = refreshedToken;
      return controller.apply(this, [
        ...params,
        session.getIdToken().payload,
        context,
      ]);
    }
    throw new AuthenticationError(e.message);
  }
};

export const checkAuthGroup = async (
  context,
  expectedGroups,
  controller,
  ...params
) => checkAuthentication(context, async user => {
  const groups = user['cognito:groups'];
  if (!groups) {
    throw new AuthorizationError('No group is attached');
  }
  if (groups && expectedGroups.some(group => !groups.includes(group))) {
    throw new AuthorizationError(
      `You are not authorized. Expected scopes: ${expectedGroups.join(', ')}`,
    );
  }
  return controller.apply(this, [...params, user, context]);
});

/**
 * @deprecated
 * @param {context} context context object
 * @param {*} controller function to be executed when checking passes
 * @param  {...any} params any params for the controller
 */
export const checkNotAuthenticated = async (context, controller, ...params) => {
  const user = await Auth.currentUserInfo();
  if (user) {
    throw new AuthenticationError(
      `You are already logged in as ${user.username}`,
    );
  }
  return controller.apply(this, [...params, context]);
};

export const filterToday = list => {
  const midnight = moment()
    .hours(0)
    .minutes(0);
  const later = moment()
    .hours(23)
    .minutes(59);
  return list.filter(
    ({ createdAt, endedAt }) => !endedAt && moment(createdAt).isBetween(midnight, later),
  );
};

/**
 * To retrieve the lambda request ID
 * @param {object} context the context object sent
 * @returns {string}
 */
export const getLambdaRequestId = context => getNestedObjectValue(context)(['event', 'requestContext', 'requestId']);

/**
 * To retrieve the api request ID
 * @param {object} context the context object sent
 * @returns {string}
 */
export const getAPIRequestId = context => getNestedObjectValue(context)(['context', 'awsRequestId']);

export const constructFileName = ({ prefix = '', fileName, fileType } = {}) => `${prefix}/${humanFormat(new Date())}-${fileName}.${mime.extension(
  fileType,
)}`;

export const paginate = (res, itemToCursor) => {
  const edges = res.Items.map(item => ({
    node: item,
    cursor: itemToCursor(item),
  }));
  const pagination = {
    hasNext: !!res.LastEvaluatedKey,
    count: res.Count,
  };
  return {
    edges,
    pagination,
  };
};
