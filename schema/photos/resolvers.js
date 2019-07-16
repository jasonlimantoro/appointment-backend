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
  Photo: {
    signedUrl: async (source, { permissions, fileType }, { dataSources }) => {
      const res = {};
      if (permissions.includes('GET')) {
        const { signedRequest: get } = await dataSources.uploadAPI.sign({
          fileName: source.key,
          fileType,
        });
        res.get = get;
      }
      if (permissions.includes('PUT')) {
        const { signedRequest: put } = await dataSources.uploadAPI.sign({
          fileName: source.key,
          fileType,
          permissionType: 'putObject',
        });
        res.put = put;
      }
      return res;
    },
  },
};

export default resolvers;
