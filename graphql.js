import { ApolloServer } from 'apollo-server-lambda';
import Amplify from '@aws-amplify/core';
import AWSConfiguration from './config/aws-exports';
import { resolvers, typeDefs } from './schema';
import {
  GuestService,
  EntryService,
  AuthService,
  SessionService,
  UploadService,
  PhotoService,
} from './services';

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
    uploadAPI: new UploadService(),
    photoAPI: new PhotoService(),
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
