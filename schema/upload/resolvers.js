import {
  checkAuthentication,
  constructFileName,
} from '../../libs/resolverUtils';

import { getServiceWithAssumedCredentials } from '../../libs/credentials';

const resolvers = {
  Query: {
    s3SignUploadGuestPhoto: (
      _source,
      { input: { fileName, fileType, entryId } },
      context,
    ) => checkAuthentication(
      context,
      async () => {
        const entry = await context.dataSources.entryAPI.get(entryId);
        const guest = await context.dataSources.guestAPI.get(entry.guestId);
        const rootDir = `${guest.NIK}-${guest.firstName}-${guest.lastName}`;
        const constructedFileName = constructFileName({
          prefix: rootDir,
          fileName,
          fileType,
        });
          // await getServiceWithAssumedCredentials(user, 'S3', replacedService => context.dataSources.uploadAPI.replaceDataSource(replacedService));
        return context.dataSources.uploadAPI.sign({
          fileName: constructedFileName,
          fileType,
          permissionType: 'putObject',
        });
      },
      'S3',
      service => {
        context.dataSources.uploadAPI.replaceDataSource(service);
      },
    ),
    s3SignGetGuestPhoto: (_source, { key }, context) => checkAuthentication(
      context,
      async user => {
        await getServiceWithAssumedCredentials(
          user,
          'S3',
          replacedService => {
            context.dataSources.uploadAPI.replaceDataSource(replacedService);
          },
        );
        const res = await context.dataSources.uploadAPI.sign({
          fileName: key,
          permissionType: 'getObject',
        });
        return res;
      },
      'S3',
      service => context.dataSources.uploadAPI.replaceDataSource(service),
    ),
  },
};

export default resolvers;
