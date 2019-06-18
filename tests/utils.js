import { ApolloServer } from 'apollo-server-lambda';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs, resolvers } from '../schema';
import {
  GuestService,
  EntryService,
  AuthService,
  SessionService,
} from '../services';

const mockContext = {
  headers: {
    authorization: 'Bearer TOKEN_STRING',
  },
};

export const createTestClientAndServer = ({ context = mockContext } = {}) => {
  const guestAPI = new GuestService();
  const entryAPI = new EntryService();
  const authAPI = new AuthService();
  const sessionAPI = new SessionService();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      guestAPI,
      entryAPI,
      authAPI,
      sessionAPI,
    }),
    context: ({ event }) => ({
      headers: context.headers,
      event,
    }),
  });
  const { query, mutate } = createTestClient(server);
  return {
    query,
    mutate,
    guestAPI,
    entryAPI,
    authAPI,
    sessionAPI,
  };
};
