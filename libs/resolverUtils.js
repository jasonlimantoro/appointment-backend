import moment from 'moment';
import mime from 'mime-types';
import { getNestedObjectValue } from 'appointment-common';
import Auth from './auth';
import { AuthenticationError, AuthorizationError } from './errors';
import { transformObjectKeysToLower } from './helpers';
import { humanFormat } from './datetime';

/**
 * Authenticates request using the JWT token in the header
 * @param {object} context the context object sent
 * @param {function} controller the function to be executed if authentication is successful
 * @param  {...any} params arguments for the controller function
 */
export const checkAuthentication = async (context, controller, ...params) => {
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
    const user = await Auth.verifyJwt(token);
    if (!user) throw new AuthenticationError();
    return controller.apply(this, [...params, user, context]);
  } catch (e) {
    // eslint-disable-next-line
    console.log(`Received Header: ${JSON.stringify(context.headers, null, 2)}`);
    throw new AuthenticationError(e.message);
  }
};

export const checkAuthGroup = async (
  context,
  expectedGroups,
  controller,
  ...params
) => {
  context.headers = transformObjectKeysToLower(context.headers);
  const authorization = getNestedObjectValue(context)([
    'headers',
    'authorization',
  ]);
  if (!authorization) {
    throw new AuthenticationError(
      `Provided header is invalid: ${JSON.stringify(context.headers)}`,
    );
  }
  const token = authorization.split(' ')[1];
  const user = await Auth.verifyJwt(token);
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
