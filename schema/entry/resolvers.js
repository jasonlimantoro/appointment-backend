const resolvers = {
  Query: {
    listEntry: (_source, _args, context) => context.dataSources.entryAPI.list(),
    // eslint-disable-next-line no-unused-vars
    getEntry: (_, args) => {},
  },
};

export default resolvers;
