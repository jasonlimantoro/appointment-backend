import gql from 'graphql-tag';
import { createTestClientAndServer } from '../utils';
import mockedData from '../../fixtures/entries';

describe('Entry Schema', () => {
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
    entryAPI.create = jest.fn().mockReturnValue(attributes);
    guestAPI.findOrCreate = jest.fn().mockReturnValue({ ...attributes.Guest, id: 'some-id' });

    const res = await mutate({ mutation: CREATE_ENTRY, variables: { input: attributes } });

    expect(guestAPI.findOrCreate).toBeCalledWith(attributes.Guest);
    expect(entryAPI.create).toBeCalledWith({
      id: attributes.id,
      see: attributes.see,
      guestID: 'some-id',
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
    const mock = mockedData[0];
    entryAPI.get = jest.fn().mockReturnValue(mock);
    const res = await query({ query: GET_ENTRY, variables: { id: mock.id } });

    expect(entryAPI.get).toBeCalledWith(mock.id);

    expect(res).toMatchSnapshot();
  });
});
