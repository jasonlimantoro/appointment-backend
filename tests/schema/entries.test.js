import gql from 'graphql-tag';
import { createTestClientAndServer } from '../utils';
import mockedEntries from '../../fixtures/entries';
import mockedGuest from '../../fixtures/guests';

describe('Entry Schema', () => {
  it('listEntry: should work', async () => {
    const { query, entryAPI, guestAPI } = createTestClientAndServer();
    entryAPI.list = jest.fn().mockResolvedValue(mockedEntries);
    guestAPI.get = jest.fn().mockResolvedValue(mockedGuest[0]);
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
    expect(guestAPI.get).toBeCalledTimes(mockedEntries.length);
    expect(res).toMatchSnapshot();
  });

  it('createEntry: should work', async () => {
    const { mutate, entryAPI, guestAPI } = createTestClientAndServer();
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
    entryAPI.create = jest.fn().mockResolvedValue(attributes);
    guestAPI.findOrCreate = jest.fn().mockResolvedValue({ ...attributes.Guest, id: 'some-id' });
    guestAPI.get = jest.fn().mockResolvedValue(attributes.Guest);

    const res = await mutate({ mutation: CREATE_ENTRY, variables: { input: attributes } });

    expect(guestAPI.findOrCreate).toBeCalledWith(attributes.Guest);
    expect(entryAPI.create).toBeCalledWith({
      id: attributes.id,
      see: attributes.see,
      guestId: 'some-id',
    });

    expect(res).toMatchSnapshot();
  });

  it('getEntry: should work', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    const GET_ENTRY = gql`
      query GetEntry($id: String!) {
        getEntry(id: $id) {
          id
          see
          createdAt
          endedAt
        }
      }
    `;
    const mock = mockedEntries[0];
    entryAPI.get = jest.fn().mockResolvedValue(mock);
    const res = await query({ query: GET_ENTRY, variables: { id: mock.id } });

    expect(entryAPI.get).toBeCalledWith(mock.id);

    expect(res).toMatchSnapshot();
  });

  it('endEntry: should work', async () => {
    const { mutate, entryAPI } = createTestClientAndServer();
    const END_ENTRY = gql`
      mutation EndEntry($id: String!) {
        endEntry(id: $id) {
          id
          see
          createdAt
          endedAt
        }
      }
    `;
    const mock = mockedEntries[0];
    entryAPI.end = jest
      .fn()
      .mockResolvedValue({ ...mock, endedAt: new Date(2020, 1, 1).toLocaleString() });
    const res = await mutate({ mutation: END_ENTRY, variables: { id: mock.id } });

    expect(entryAPI.end).toBeCalledWith(mock.id);
    expect(res).toMatchSnapshot();
  });
});
