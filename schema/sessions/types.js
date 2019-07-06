import gql from 'graphql-tag';

export default gql`
  type Session {
    id: String!
    createdAt: String!
    endedAt: String!
    userId: String!
  }
`;
