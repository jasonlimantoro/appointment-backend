import { ApolloServer } from 'apollo-server-lambda';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs, resolvers } from '../schema';
import GuestService from '../services/guest.service';
import EntryService from '../services/entry.service';

export const createTestClientAndServer = () => {
  const guestAPI = new GuestService();
  const entryAPI = new EntryService();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ guestAPI, entryAPI }),
  });
  const { query, mutate } = createTestClient(server);
  return {
    query, mutate, guestAPI, entryAPI,
  };
};
