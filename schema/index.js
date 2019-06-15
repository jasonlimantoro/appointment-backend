import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import root from './root.graphql';
import { resolvers as entryResolver, typeDefs as entryTypeDefs } from './entry';
import { resolvers as guestResolver, typeDefs as guestTypeDefs } from './guest';

const typeDefs = [root, entryTypeDefs, guestTypeDefs];
const resolvers = merge(entryResolver, guestResolver);

export { typeDefs, resolvers };
export default makeExecutableSchema({ typeDefs, resolvers });
