import gql from 'graphql-tag';

export default gql`
  type Signed {
    get: String
    put: String
  }
  enum Permission {
    GET
    PUT
  }

  type Photo {
    id: String!
    entry: Entry!
    key: String!
    createdAt: String!
    signedUrl(
      permissions: [Permission] = [GET]
      fileType: String = "image/jpeg"
    ): Signed
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
