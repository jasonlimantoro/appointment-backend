import gql from 'graphql-tag';
import { createTestClientAndServer } from '../utils';
import mockedGuests from '../../fixtures/guests';
import mockedEntries from '../../fixtures/entries';

describe('Guest schema', () => {
  it('listGuest: should work', async () => {
    const { query, guestAPI, entryAPI } = createTestClientAndServer();
    guestAPI.list = jest.fn(() => mockedGuests);
    entryAPI.byGuestId = jest.fn().mockResolvedValue(mockedEntries);
    const LIST_GUEST = gql`
      query guests {
        listGuest {
          id
          firstName
          lastName
          email
          entryToday {
            id
            see
            createdAt
          }
        }
      }
    `;
    const result = await query({ query: LIST_GUEST });
    expect(result).toMatchSnapshot();
    expect(guestAPI.list).toBeCalled();
    expect(entryAPI.byGuestId).toBeCalled();
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
    const result = await query({
      query: GET_GUEST,
      variables: { id: 'some-id' },
    });
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
    const result = await query({
      query: BY_NAME,
      variables: { input: { firstName, lastName } },
    });
    expect(guestAPI.byName).toBeCalledWith({ firstName, lastName });
    expect(result).toMatchSnapshot();
  });

  it('create guest: should work', async () => {
    const { mutate, guestAPI } = createTestClientAndServer();
    const attributes = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      NIK: '12345',
    };
    guestAPI.create = jest
      .fn()
      .mockResolvedValue({ ...attributes, id: 'some-id' });

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
    const result = await mutate({
      mutation: CREATE_GUEST,
      variables: { input: attributes },
    });
    expect(guestAPI.create).toBeCalledWith(attributes);
    expect(result).toMatchSnapshot();
  });
});
