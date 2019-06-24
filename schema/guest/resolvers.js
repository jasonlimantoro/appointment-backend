import moment from 'moment';

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
      let res = await dataSources.entryAPI.byGuestId(source.id);
      const today = moment();
      const yesterday = moment().subtract(1, 'days');
      res = res.filter(({ createdAt, endedAt }) => !endedAt && moment(createdAt).isBetween(yesterday, today));
      return res;
    },
  },
};

export default resolvers;
