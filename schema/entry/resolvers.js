const resolvers = {
  Query: {
    listEntry: (_source, _args, context) => context.dataSources.entryAPI.list(),
    // eslint-disable-next-line no-unused-vars
    getEntry: (_, args) => {},
  },
  Mutation: {
    createEntry: async (_source, { input }, { dataSources }) => {
      const guest = await dataSources.guestAPI.findOrCreate(input.Guest);
      const res = await dataSources.entryAPI.create({
        id: input.id,
        see: input.see,
        guestID: guest.id,
      });
      return res;
    },
  },
};

export default resolvers;
