import { checkAuthentication } from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    s3Sign: async (_source, { fileName, fileType }, context) => checkAuthentication(context, context.dataSources.uploadAPI.sign, {
      fileName,
      fileType,
    }),
  },
};

export default resolvers;
