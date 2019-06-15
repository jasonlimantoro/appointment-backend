const resolvers = {
  Query: {
    listEntry: (_source, _args, context) => context.dataSources.entryAPI.list(),
    getEntry: (_source, args, context) => context.dataSources.entryAPI.get(args.id),
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
