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
          id: Buffer.from(session.id).toString('base64'),
        },
      };
    },
    logout: async (_source, args, { dataSources }) => {
      try {
        const endSession = await dataSources.sessionAPI.end({
          id: Buffer.from(args.sessionId, 'base64').toString('ascii'),
        });
        if (endSession) {
          return true;
        }
      } catch (e) {
        throw e;
      }
    },
  },
};

export default resolvers;