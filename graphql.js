import { ApolloServer, gql } from 'apollo-server-lambda';
import { resolvers, typeDefs } from './schema';

const rootQuery = gql`
	type Query {
		_empty: String
	}
`;

const server = new ApolloServer({
  typeDefs: [rootQuery, ...typeDefs],
  resolvers,
  formatError: error => error,
  formatResponse: response => response,
});

const hello = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});

export { hello };
