import jwt from 'jsonwebtoken';
import { LogoutError } from '../../libs/errors';

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
        session,
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
        throw new LogoutError(e.message);
      }
    },
  },
  Session: {
    id: source => Buffer.from(source.id).toString('base64'),
  },
};

export default resolvers;
