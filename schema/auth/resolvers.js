const resolvers = {
  Mutation: {
    login: (_source, args, { dataSources }) => dataSources.authAPI.login(args),
  },
};

export default resolvers;
