import { checkAuthentication } from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    photoByEntry: (_source, args, context) => checkAuthentication(
      context,
      async () => context.dataSources.photoAPI.byEntry(args.entryId),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.photoAPI.replaceDataSource(service);
      },
    ),
  },
  Mutation: {
    createPhoto: (_source, { input: { key, entryId } }, context) => checkAuthentication(
      context,
      async () => context.dataSources.photoAPI.create({ key, entryId }),
      'DynamoDB.DocumentClient',
      service => context.dataSources.photoAPI.replaceDataSource(service),
    ),
  },
};

export default resolvers;
