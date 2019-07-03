const resolvers = {
  Query: {
    photoByEntry: (_source, args, context) => context.dataSources.photoAPI.byEntry(args.entryId),
  },
  Mutation: {
    createPhoto: (_source, { input: { key, entryId } }, context) => context.dataSources.photoAPI.create({ key, entryId }),
  },
};

export default resolvers;
