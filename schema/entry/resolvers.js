import { checkAuthentication, filterToday } from '../../libs/resolverUtils';

const resolvers = {
  Query: {
    listEntry: (_source, _args, context) => checkAuthentication(context, context.dataSources.entryAPI.list),
    listTodayEntry: (_source, args, context) => checkAuthentication(context, async () => {
      let res;
      if (args.NIK) {
        res = await context.dataSources.entryAPI.byGuestId(args.NIK);
      } else {
        res = await context.dataSources.entryAPI.list();
      }
      return filterToday(res);
    }),
    getEntry: (_source, args, context) => context.dataSources.entryAPI.get(args.id),
    byGuestId: (_source, args, context) => context.dataSources.entryAPI.byGuestId(args.NIK),
  },
  Mutation: {
    createEntry: async (_source, { input }, context) => checkAuthentication(context, async () => {
      const guest = await context.dataSources.guestAPI.findOrCreate(
        input.Guest,
      );
      const res = await context.dataSources.entryAPI.create({
        id: input.id,
        see: input.see,
        guestId: guest.NIK,
      });
      return { ...res, Guest: guest };
    }),
    endEntry: async (_source, args, context) => checkAuthentication(context, () => context.dataSources.entryAPI.end(args.id)),
  },
  Entry: {
    Guest: (source, args, context) => context.dataSources.guestAPI.get(source.guestId),
    photo: (source, args, context) => context.dataSources.photoAPI.byEntry(source.id),
  },
};

export default resolvers;
