import { ApolloServer } from 'apollo-server-lambda';
import { resolvers, typeDefs } from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => error,
  formatResponse: response => response,
});

const hello = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

export { hello };
