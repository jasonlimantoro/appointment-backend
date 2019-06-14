import { ApolloServer } from 'apollo-server-lambda';
import { resolvers, typeDefs } from './schema';
import GuestService from './services/guest.service';
import EntryService from './services/entry.service';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => error,
  formatResponse: response => response,
  dataSources: () => ({
    guestAPI: new GuestService(),
    entryAPI: new EntryService(),
  }),
});

const hello = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

export { hello };
