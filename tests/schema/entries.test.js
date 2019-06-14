import gql from 'graphql-tag';
import { createTestClient } from 'apollo-server-testing';
import { createTestServer } from '../utils';
import mockedData from '../../fixtures/entries';

describe('Entry Schema', () => {
  const createTestClientAndServer = () => {
    const { server, entryAPI, guestAPI } = createTestServer();
    const { query } = createTestClient(server);
    return { query, entryAPI, guestAPI };
  };
  it('listEntry: should work', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    entryAPI.list = jest.fn().mockReturnValue(mockedData);
    const LIST_ENTRY = gql`
      query {
        listEntry {
          Guest {
            firstName
            lastName
            NIK
          }
          see
          createdAt
          endedAt
        }
      }
    `;
    const res = await query({ query: LIST_ENTRY });
    expect(entryAPI.list).toBeCalled();
    expect(res).toMatchSnapshot();
  });

  it('createEntry: should work', async () => {
    const { query, entryAPI, guestAPI } = createTestClientAndServer();
    const attributes = {
      id: 'asdf',
      see: 'xyz',
      Guest: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        company: 'Amazon',
        NIK: 'abcdefghijklmnop',
      },
    };
    const CREATE_ENTRY = gql`
      mutation CreateEntry($input: CreateEntryInput!) {
        createEntry(input: $input) {
          id
          see
          Guest {
            firstName
            lastName
            email
          }
        }
      }
    `;
    entryAPI.create = jest.fn().mockReturnValue(attributes);
    guestAPI.findOrCreate = jest.fn().mockReturnValue({ ...attributes.Guest, id: 'some-id' });

    const res = await query({ query: CREATE_ENTRY, variables: { input: attributes } });

    expect(guestAPI.findOrCreate).toBeCalledWith(attributes.Guest);
    expect(entryAPI.create).toBeCalledWith({
      id: attributes.id,
      see: attributes.see,
      guestID: 'some-id',
    });

    expect(res).toMatchSnapshot();
  });
});
