const resolvers = {
  Query: {
    listGuest: (_source, _args, context) => context.dataSources.GuestAPI.list(),
    getGuest: (_source, args, context) => context.dataSources.GuestAPI.get(args.id),
    createGuest: (_source, args, context) => context.dataSources.GuestAPI.create(args.input),
  },
};

export default resolvers;
