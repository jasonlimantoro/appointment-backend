import gql from 'graphql-tag';

export default gql`
  type Guest {
    NIK: String!
    firstName: String!
    lastName: String
    email: String!
    company: String
    entryToday: [Entry]
  }

  input CreateGuestInput {
    NIK: String!
    firstName: String!
    lastName: String
    email: String!
    company: String
  }

  input ByNameInput {
    firstName: String!
    lastName: String!
  }

  extend type Query {
    listGuest: [Guest]
    getGuest(NIK: String!): Guest
    byName(input: ByNameInput!): Guest
  }

  extend type Mutation {
    createGuest(input: CreateGuestInput!): Guest
  }
`;
