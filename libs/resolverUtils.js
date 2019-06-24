import moment from 'moment';
import { getNestedObjectValue } from 'appointment-common';
import Auth from './auth';
import { AuthenticationError } from './errors';
import { transformObjectKeysToLower } from './helpers';

export const checkAuthentication = async (context, controller) => {
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
  if (!user) throw new AuthenticationError();
  return controller();
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
