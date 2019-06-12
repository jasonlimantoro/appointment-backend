import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { createTestServer } from '../utils';
import { mockedGuests } from '../../fixtures/guests';

describe('Guest schema', () => {
  const createTestClientAndServer = () => {
    const { server, guestAPI } = createTestServer();
    const { query } = createTestClient(server);
    guestAPI.list = jest.fn(() => mockedGuests);
    return { query };
  };
  it('listGuest: should work', async () => {
    const { query } = createTestClientAndServer();

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
    expect(result.data).toMatchSnapshot();
  });

  it('getGuest: should work', async () => {
    const { query } = createTestClientAndServer();
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
    const result = await query({ query: GET_GUEST, variables: { id: 'ah' } });
    expect(result.data).toMatchSnapshot();
  });
});
