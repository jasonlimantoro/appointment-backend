import gql from 'graphql-tag';
import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers as entryResolver, typeDefs as entryTypeDefs } from './entry';
import { resolvers as guestResolver, typeDefs as guestTypeDefs } from './guest';

const root = gql`
	type Query {
		root: String
	}
	type Mutation {
		root: String
	}
	type Subscription {
		root: String
	}
`;

const typeDefs = [root, entryTypeDefs, guestTypeDefs];
const resolvers = merge(entryResolver, guestResolver);

export { typeDefs, resolvers };
export default makeExecutableSchema({ typeDefs, resolvers });
