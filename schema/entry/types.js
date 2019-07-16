import gql from 'graphql-tag';

const typeDefs = gql`
  enum Status {
    ONGOING
    FINISHED
  }
  type Entry {
    id: String!
    see: String!
    createdAt: String! @date
    endedAt: String
    status: Status
    Guest: Guest!
    photo: [Photo!]!
    userId: String!
  }

  input CreateEntryInput {
    id: String
    see: String!
    guestId: String
    Guest: CreateGuestInput!
  }

  type Query {
    listEntry: [Entry]
    listTodayEntry(NIK: String): [Entry]
    listOngoingEntry: [Entry]
    getEntry(id: String!): Entry
    byGuestId(NIK: String!): [Entry]
  }

  type Mutation {
    createEntry(input: CreateEntryInput!): Entry!
    endEntry(id: String!): Entry!
  }
`;

export default typeDefs;
