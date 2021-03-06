import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
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
import { typeDefs as directiveTypeDefs, DateDirective } from './directives';

const typeDefs = [
  entryTypeDefs,
  guestTypeDefs,
  authTypeDefs,
  sessionTypeDefs,
  uploadTypeDefs,
  photoTypeDefs,
  directiveTypeDefs,
];
const resolvers = [
  entryResolver,
  guestResolver,
  authResolver,
  uploadResolver,
  photoResolver,
];

export { typeDefs, resolvers };
export default makeExecutableSchema({
  typeDefs: mergeTypes(typeDefs),
  resolvers: mergeResolvers(resolvers),
  schemaDirectives: {
    date: DateDirective,
  },
});
