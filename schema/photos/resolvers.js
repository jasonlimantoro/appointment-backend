const resolvers = {
  Query: {},
  Mutation: {
    createPhoto: (_source, { input: { key, entryId } }, context) => context.dataSources.photoAPI.create({ key, entryId }),
  },
};

export default resolvers;
