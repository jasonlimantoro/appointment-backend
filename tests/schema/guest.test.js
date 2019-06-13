import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { createTestServer } from '../utils';
import mockedGuests from '../../fixtures/guests';

describe('Guest schema', () => {
  const createTestClientAndServer = () => {
    const { server, guestAPI } = createTestServer();
    const { query } = createTestClient(server);
    return { query, guestAPI };
  };
  it('listGuest: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    guestAPI.list = jest.fn(() => mockedGuests);

    const LIST_GUEST = gql`
      query guests {
        listGuest {
          id
          firstName
          lastName
          email
        }
      }
    `;
    const result = await query({ query: LIST_GUEST });
    expect(guestAPI.list).toBeCalled();
    expect(result).toMatchSnapshot();
  });

  it('getGuest: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    guestAPI.get = jest.fn(() => mockedGuests[0]);
    const GET_GUEST = gql`
      query guest($id: String!) {
        getGuest(id: $id) {
          id
          firstName
          lastName
          email
        }
      }
    `;
    const result = await query({ query: GET_GUEST, variables: { id: 'some-id' } });
    expect(guestAPI.get).toBeCalledWith('some-id');
    expect(result).toMatchSnapshot();
  });

  it('byName: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    const guest = mockedGuests[0];
    const { firstName, lastName } = guest;
    guestAPI.byName = jest.fn().mockResolvedValue(guest);
    const BY_NAME = gql`
      query guestByName($input: ByNameInput!) {
        byName(input: $input) {
          id
          firstName
          lastName
          email
        }
      }
    `;
    const result = await query({ query: BY_NAME, variables: { input: { firstName, lastName } } });
    expect(guestAPI.byName).toBeCalledWith({ firstName, lastName });
    expect(result).toMatchSnapshot();
  });

  it('create guest: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    const attributes = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      NIK: '12345',
    };
    guestAPI.create = jest.fn().mockResolvedValue({ ...attributes, id: 'some-id' });

    const CREATE_GUEST = gql`
      mutation CreateGuest($input: CreateGuestInput!) {
        createGuest(input: $input) {
          id
          firstName
          lastName
          email
          NIK
          company
        }
      }
    `;
    const result = await query({ query: CREATE_GUEST, variables: { input: attributes } });
    expect(guestAPI.create).toBeCalledWith(attributes);
    expect(result).toMatchSnapshot();
  });
});
