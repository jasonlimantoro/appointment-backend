const resolvers = {
  Query: {
    listEntry: async (_source, _args, { dataSources }) => {
      const allEntries = await dataSources.entryAPI.list();
      const results = [];
      await allEntries.forEach(entry => {
        results.push({
          ...entry,
          Guest: dataSources.guestAPI.get(entry.guestId),
        });
      });
      return results;
    },
    // eslint-disable-next-line no-unused-vars
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
};

export default resolvers;
