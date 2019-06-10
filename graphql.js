import { ApolloServer, gql } from 'apollo-server-lambda';

import { merge } from 'lodash';
import { typeDefs as guestTypes, resolvers as guestResolvers } from './schema/guest';
import { typeDefs as entryTypes, resolvers as entryResolvers } from './schema/entry';

const rootQuery = gql`
	type Query {
		_empty: String
	}
`;
const resolvers = merge(guestResolvers, entryResolvers);

const server = new ApolloServer({
  typeDefs: [rootQuery, guestTypes, entryTypes],
  resolvers,
});

const hello = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

export { hello };
