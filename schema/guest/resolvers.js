const resolvers = {
  Query: {
    listGuest: (_source, _args, context) => context.dataSources.guestAPI.list(),
    getGuest: (_source, args, context) => context.dataSources.guestAPI.get(args.id),
    byName: (_source, args, context) => context.dataSources.guestAPI.byName(args.input),
    createGuest: (_source, args, context) => context.dataSources.guestAPI.create(args.input),
  },
};

export default resolvers;
