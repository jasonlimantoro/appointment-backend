import {
  checkAuthentication,
  constructFileName,
} from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    s3SignUploadGuestPhoto: (
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
        permissionType: 'putObject',
      });
    }),
    s3SignGetGuestPhoto: (_source, { key }, context) => checkAuthentication(context, async () => {
      const res = await context.dataSources.uploadAPI.sign({
        fileName: key,
        permissionType: 'getObject',
      });
      return res;
    }),
  },
};

export default resolvers;
