import gql from 'graphql-tag';

export default gql`
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
