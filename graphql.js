import { ApolloServer } from 'apollo-server-lambda';
import { resolvers, typeDefs } from './schema';
import GuestService from './services/guest';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => error,
  formatResponse: response => response,
  dataSources: () => ({
    GuestAPI: new GuestService(),
  }),
});

const hello = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

export { hello };
