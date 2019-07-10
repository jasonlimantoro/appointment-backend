import { ApolloServer } from 'apollo-server-lambda';
import { createTestClient } from 'apollo-server-testing';
import schema from '../schema';
import {
  GuestService,
  EntryService,
  AuthService,
  SessionService,
  UploadService,
  PhotoService,
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
  const uploadAPI = new UploadService();
  const photoAPI = new PhotoService();
  const server = new ApolloServer({
    schema,
    dataSources: () => ({
      guestAPI,
      entryAPI,
      authAPI,
      sessionAPI,
      uploadAPI,
      photoAPI,
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
    uploadAPI,
    photoAPI,
  };
};
