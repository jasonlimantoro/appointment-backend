import { ApolloServer } from 'apollo-server-lambda';
import Amplify from '@aws-amplify/core';
import AWSConfiguration from './config/aws-exports';
import { resolvers, typeDefs } from './schema';
import GuestService from './services/guest.service';
import EntryService from './services/entry.service';
import AuthService from './services/auth.service';
import SessionService from './services/session.service';

Amplify.configure(AWSConfiguration);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => error,
  formatResponse: response => response,
  dataSources: () => ({
    guestAPI: new GuestService(),
    entryAPI: new EntryService(),
    authAPI: new AuthService(),
    sessionAPI: new SessionService(),
  }),
  context: ({ event, context }) => ({
    headers: event.headers,
    event,
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
