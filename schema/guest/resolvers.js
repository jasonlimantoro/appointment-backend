import { filterToday } from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    listGuest: (_source, _args, context) => context.dataSources.guestAPI.list(),
    getGuest: (_source, args, context) => context.dataSources.guestAPI.get(args.id),
    byName: (_source, args, context) => context.dataSources.guestAPI.byName(args.input),
  },
  Mutation: {
    createGuest: (_source, args, context) => context.dataSources.guestAPI.create(args.input),
  },
  Guest: {
    entryToday: async (source, _args, { dataSources }) => {
      const res = await dataSources.entryAPI.byGuestId(source.id);
      return filterToday(res);
    },
  },
};

export default resolvers;
