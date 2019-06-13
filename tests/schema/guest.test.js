import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { createTestServer } from '../utils';
import { mockedGuests } from '../../fixtures/guests';

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
    expect(result).toMatchSnapshot();
  });

  it('getGuest: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    guestAPI.get = jest.fn(() => mockedGuests[0]);
    const GET_GUEST = gql`
      query guest($input: getGuestInput!) {
        getGuest(input: $input) {
          id
          firstName
          lastName
          email
        }
      }
    `;
    const result = await query({ query: GET_GUEST, variables: { input: { id: 'some-id' } } });
    expect(result).toMatchSnapshot();
  });
});
