import { ApolloServer } from 'apollo-server-lambda';
import Amplify from 'aws-amplify';
import AWSConfiguration from './config/aws-exports';
import { resolvers, typeDefs } from './schema';
import GuestService from './services/guest.service';
import EntryService from './services/entry.service';

Amplify.configure(AWSConfiguration);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => error,
  formatResponse: response => response,
  dataSources: () => ({
    guestAPI: new GuestService(),
    entryAPI: new EntryService(),
  }),
  context: ({ event, context }) => ({
    headers: event.headers,
    context,
  }),
});

const hello = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

export { hello };
