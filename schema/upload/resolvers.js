import {
  checkAuthentication,
  constructFileName,
} from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    s3Sign: async (
      _source,
      { input: { fileName, fileType, entryId } },
      context,
    ) => checkAuthentication(context, async () => {
      const entry = await context.dataSources.entryAPI.get(entryId);
      const guest = await context.dataSources.guestAPI.get(entry.guestId);
      const rootDir = `${guest.NIK}-${guest.firstName}-${guest.lastName}`;
      const constructedFileName = constructFileName({
        prefix: rootDir,
        fileName,
        fileType,
      });
      return context.dataSources.uploadAPI.sign({
        fileName: constructedFileName,
        fileType,
      });
    }),
  },
};

export default resolvers;
