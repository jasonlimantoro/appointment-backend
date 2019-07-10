import gql from 'graphql-tag';

export default gql`
  type Photo {
    id: String!
    entry: Entry!
    key: String!
    createdAt: String!
  }

  input CreatePhotoInput {
    id: String
    entryId: String!
    key: String!
  }

  type Query {
    photoByEntry(entryId: String!): [Photo]!
  }
  type Mutation {
    createPhoto(input: CreatePhotoInput!): Photo!
  }
`;
