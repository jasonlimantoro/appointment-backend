import gql from 'graphql-tag';
import { STATUS } from '../../database/models/entry';

const typeDefs = gql`
  enum Status {
    ${STATUS.ONGOING}
    ${STATUS.ENDED}
  }
  type PageInfo {
    hasNext: Boolean!
    count: Int!
  }
  type EntryEdge {
    node: Entry!
    cursor: String!
  }

  type EntryConnection {
    pagination: PageInfo!
    edges: [EntryEdge]!
  }

  type Entry {
    id: String!
    see: String!
    createdAt: String! @date
    endedAt: String @date
    status: Status
    Guest: Guest!
    photo: [Photo!]!
    Session: [Session!]!
  }

  input CreateEntryInput {
    id: String
    see: String!
    guestId: String
    sessionId: String!
    Guest: CreateGuestInput!
  }
  input PaginationInput {
    first: Int = 10
    after: String
  }

  type Query {
    listEntry(paginate: PaginationInput): EntryConnection
    listTodayEntry(NIK: String, paginate: PaginationInput): EntryConnection
    listOngoingEntry(paginate: PaginationInput): EntryConnection
    getEntry(id: String!): Entry
    byGuestId(NIK: String!): [Entry]
  }

  type Mutation {
    createEntry(input: CreateEntryInput!): Entry!
    endEntry(id: String!): Entry!
  }
`;

export default typeDefs;
