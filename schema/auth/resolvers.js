import jwt from 'jsonwebtoken';

const resolvers = {
  Mutation: {
    login: async (_source, args, { dataSources }) => {
      const res = await dataSources.authAPI.login(args);
      const decoded = jwt.decode(res);
      await dataSources.sessionAPI.create({
        userId: decoded.sub,
      });
      return res;
    },
    logout: async (_source, args, { dataSources }) => {
      const endSession = await dataSources.sessionAPI.end({
        id: args.sessionId,
      });
      if (endSession) {
        return true;
      }
      return false;
    },
  },
};

export default resolvers;
