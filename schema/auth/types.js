import gql from 'graphql-tag';

const typeDefs = gql`
  type LoginPayload {
    session: Session!
    token: String!
  }
  type RefreshPayload {
    token: String!
  }
  type Mutation {
    login(username: String!, password: String!): LoginPayload!
    logout(sessionId: String!): Boolean!
  }
  type Query {
    refreshToken(cognitoUsername: String!): RefreshPayload!
  }
`;

export default typeDefs;
