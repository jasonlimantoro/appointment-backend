import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import root from './root.graphql';
import { resolvers as entryResolver, typeDefs as entryTypeDefs } from './entry';
import { resolvers as guestResolver, typeDefs as guestTypeDefs } from './guest';
import { resolvers as authResolver, typeDefs as authTypeDefs } from './auth';
import { typeDefs as sessionTypeDefs } from './sessions';

const typeDefs = [
  root,
  entryTypeDefs,
  guestTypeDefs,
  authTypeDefs,
  sessionTypeDefs,
];
const resolvers = merge(entryResolver, guestResolver, authResolver);

export { typeDefs, resolvers };
export default makeExecutableSchema({ typeDefs, resolvers });
