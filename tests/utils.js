import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs, resolvers } from '../schema';
import GuestService from '../services/guest.service';

export const createTestServer = () => {
  const guestAPI = new GuestService();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ GuestAPI: guestAPI }),
  });
  return { server, guestAPI };
};
