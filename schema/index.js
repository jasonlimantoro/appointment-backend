import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import root from './root.graphql';
import { resolvers as entryResolver, typeDefs as entryTypeDefs } from './entry';
import { resolvers as guestResolver, typeDefs as guestTypeDefs } from './guest';
import { resolvers as authResolver, typeDefs as authTypeDefs } from './auth';
import { typeDefs as sessionTypeDefs } from './sessions';
import {
  resolvers as uploadResolver,
  typeDefs as uploadTypeDefs,
} from './upload';
import {
  resolvers as photoResolver,
  typeDefs as photoTypeDefs,
} from './photos';

const typeDefs = [
  root,
  entryTypeDefs,
  guestTypeDefs,
  authTypeDefs,
  sessionTypeDefs,
  uploadTypeDefs,
  photoTypeDefs,
];
const resolvers = merge(
  entryResolver,
  guestResolver,
  authResolver,
  uploadResolver,
  photoResolver,
);

export { typeDefs, resolvers };
export default makeExecutableSchema({ typeDefs, resolvers });
