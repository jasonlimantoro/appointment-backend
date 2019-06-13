import gql from 'graphql-tag';
import { createTestClient } from 'apollo-server-testing';
import { createTestServer } from '../utils';
import mockedData from '../../fixtures/entries';

describe('Entry Schema', () => {
  const createTestClientAndServer = () => {
    const { server, entryAPI } = createTestServer();
    const { query } = createTestClient(server);
    return { query, entryAPI };
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
});
