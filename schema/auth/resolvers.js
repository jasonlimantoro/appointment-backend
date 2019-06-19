import jwt from 'jsonwebtoken';

const resolvers = {
  Mutation: {
    login: async (_source, args, { dataSources }) => {
      const token = await dataSources.authAPI.login(args);
      const decoded = jwt.decode(token);
      const session = await dataSources.sessionAPI.create({
        userId: decoded.sub,
      });
      return {
        token,
        session: {
          ...session,
          // encode the session id
          id: btoa(session.id),
        },
      };
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
