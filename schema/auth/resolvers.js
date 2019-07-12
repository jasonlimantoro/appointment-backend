import jwt from 'jsonwebtoken';
import { LogoutError } from '../../libs/errors';
import { getServiceWithAssumedCredentials } from '../../libs/credentials';
import { checkAuthentication } from '../../libs/resolverUtils';

const resolvers = {
  Mutation: {
    login: async (_source, args, context) => {
      const token = await context.dataSources.authAPI.login(args);
      const decoded = jwt.decode(token);
      await getServiceWithAssumedCredentials(
        decoded,
        'DynamoDB.DocumentClient',
        replacedService => {
          context.dataSources.sessionAPI.replaceDataSource(replacedService);
        },
      );
      const session = await context.dataSources.sessionAPI.create({
        userId: decoded.sub,
      });
      return {
        token,
        session,
      };
    },
    logout: async (_source, args, context) => checkAuthentication(
      context,
      async () => {
        try {
          await context.dataSources.authAPI.logout();
          const endSession = await context.dataSources.sessionAPI.end({
            id: Buffer.from(args.sessionId, 'base64').toString('ascii'),
          });
          if (endSession) {
            return true;
          }
        } catch (e) {
          throw new LogoutError(e.message);
        }
      },
      'DynamoDB.DocumentClient',
      service => context.dataSources.sessionAPI.replaceDataSource(service),
    ),
  },
  Session: {
    id: source => Buffer.from(source.id).toString('base64'),
  },
};

export default resolvers;
