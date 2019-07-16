import { checkAuthentication, filterToday } from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    listEntry: (_source, _args, context) => checkAuthentication(
      context,
      async () => context.dataSources.entryAPI.list(),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
    listTodayEntry: (_source, args, context) => checkAuthentication(
      context,
      async () => {
        let res;
        if (args.NIK) {
          res = await context.dataSources.entryAPI.byGuestId(args.NIK);
        } else {
          res = await context.dataSources.entryAPI.list();
        }
        return filterToday(res);
      },
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
    listOngoingEntry: (_source, args, context) => checkAuthentication(
      context,
      async () => {
        const res = await context.dataSources.entryAPI.onGoing();
        return res;
      },
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
    getEntry: (_source, args, context) => checkAuthentication(
      context,
      async () => context.dataSources.entryAPI.get(args.id),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
    byGuestId: (_source, args, context) => checkAuthentication(
      context,
      async () => context.dataSources.entryAPI.byGuestId(args.NIK),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
  },
  Mutation: {
    createEntry: async (_source, { input }, context) => checkAuthentication(
      context,
      async user => {
        const guest = await context.dataSources.guestAPI.findOrCreate(
          input.Guest,
        );
        const res = await context.dataSources.entryAPI.create({
          id: input.id,
          see: input.see,
          guestId: guest.NIK,
          userId: user.sub,
        });
        return { ...res, Guest: guest };
      },
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.guestAPI.replaceDataSource(service);
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
    endEntry: async (_source, args, context) => checkAuthentication(
      context,
      () => context.dataSources.entryAPI.end(args.id),
      'DynamoDB.DocumentClient',
      service => {
        context.dataSources.entryAPI.replaceDataSource(service);
      },
    ),
  },
  Entry: {
    Guest: (source, args, context) => context.dataSources.guestAPI.get(source.guestId),
    photo: (source, args, context) => context.dataSources.photoAPI.byEntry(source.id),
  },
};

export default resolvers;
