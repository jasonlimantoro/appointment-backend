import { ApolloServer } from 'apollo-server-lambda';
import { typeDefs, resolvers } from '../schema';
import GuestService from '../services/guest.service';
import EntryService from '../services/entry.service';

export const createTestServer = () => {
  const guestAPI = new GuestService();
  const entryAPI = new EntryService();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ guestAPI, entryAPI }),
  });
  return { server, guestAPI, entryAPI };
};
