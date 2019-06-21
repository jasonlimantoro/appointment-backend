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

const resolvers = {
  Query: {
    listEntry: (_source, _args, context) => checkAuthentication(context, context.dataSources.entryAPI.list),
    getEntry: (_source, args, context) => context.dataSources.entryAPI.get(args.id),
    byGuestId: (_source, args, context) => context.dataSources.entryAPI.byGuestId(args.id),
  },
  Mutation: {
    createEntry: async (_source, { input }, { dataSources }) => {
      const guest = await dataSources.guestAPI.findOrCreate(input.Guest);
      const res = await dataSources.entryAPI.create({
        id: input.id,
        see: input.see,
        guestId: guest.id,
      });
      return { ...res, Guest: guest };
    },
    endEntry: async (_source, args, { dataSources }) => dataSources.entryAPI.end(args.id),
  },
  Entry: {
    Guest: (source, args, context) => context.dataSources.guestAPI.get(source.guestId),
  },
};

export default resolvers;
