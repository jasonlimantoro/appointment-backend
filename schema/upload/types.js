import gql from 'graphql-tag';

export default gql`
  type S3SignGuestPhotoPayload {
    key: String!
    signedRequest: String!
  }

  input S3SignGuestPhotoInput {
    fileName: String!
    fileType: String!
    entryId: String!
  }

  extend type Query {
    s3SignUploadGuestPhoto(
      input: S3SignGuestPhotoInput!
    ): S3SignGuestPhotoPayload!
    s3SignGetGuestPhoto(key: String!): S3SignGuestPhotoPayload!
  }
`;
