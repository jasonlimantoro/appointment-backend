import { getNestedObjectValue } from 'appointment-common';
import Auth from '../../auth';
import { AuthenticationError } from '../../libs/errors';
import { transformObjectKeysToLower } from '../../libs/helpers';

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
