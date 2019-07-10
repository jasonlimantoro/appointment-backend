import gql from 'graphql-tag';

const typeDefs = gql`
  type LoginPayload {
    session: Session!
    token: String!
  }
  type Mutation {
    login(username: String!, password: String!): LoginPayload!
    logout(sessionId: String!): Boolean!
  }
`;

export default typeDefs;
