const resolvers = {
  Query: {
    listGuest: (_source, _args, context) => context.dataSources.GuestAPI.list(),
    getGuest: (_source, args, context) => context.dataSources.GuestAPI.get(args.id),
  },
};

export default resolvers;
