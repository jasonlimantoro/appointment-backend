import { ApolloServer } from 'apollo-server-lambda';
import Amplify from '@aws-amplify/core';
import AWS from 'aws-sdk';
import AWSConfiguration from './config/aws-exports';
import schema from './schema';
import {
  GuestService,
  EntryService,
  AuthService,
  SessionService,
  UploadService,
  PhotoService,
} from './services';

Amplify.configure(AWSConfiguration);

const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: AWSConfiguration.Auth.identityPoolId,
  Logins:
    (AWS.config.credentials.params && AWS.config.credentials.params.Logins)
    || {},
});

AWS.config.credentials = credentials;

/* eslint-disable no-console */
const server = new ApolloServer({
  schema,
  formatError: error => {
    console.log(error);
    return error;
  },
  formatResponse: response => {
    console.log(response);
    return response;
  },
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
