import { filterToday, checkAuthentication } from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    listGuest: (_source, _args, context) => checkAuthentication(
      context,
      async () => context.dataSources.guestAPI.list(),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.guestAPI.replaceDataSource(service);
      },
    ),
    getGuest: (_source, args, context) => checkAuthentication(
      context,
      async () => context.dataSources.guestAPI.get(args.NIK),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.guestAPI.replaceDataSource(service);
      },
    ),
    byName: (_source, args, context) => checkAuthentication(
      context,
      async () => context.dataSources.guestAPI.byName(args.input),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.guestAPI.replaceDataSource(service);
      },
    ),
  },
  Mutation: {
    createGuest: (_source, args, context) => checkAuthentication(
      context,
      async () => context.dataSources.guestAPI.create(args.input),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.guestAPI.replaceDataSource(service);
      },
    ),
  },
  Guest: {
    entryToday: async (source, _args, { dataSources }) => {
      const res = await dataSources.entryAPI.byGuestId(source.NIK);
      return filterToday(res);
    },
  },
};

export default resolvers;
