import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory } from '../../factories';
import '../../dbHooks';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
beforeEach(async () => {
  credentialUtils.getServiceWithAssumedCredentials = jest
    .fn()
    .mockResolvedValue(true);
  spiedJwtVerification.mockRejectedValue(
    new Error('Authenticated routes should be proteced'),
  );
});
afterEach(() => {
  credentialUtils.getServiceWithAssumedCredentials.mockClear();
  spiedJwtVerification.mockReset();
});
describe('listEntry', () => {
  it.only('should work', async () => {
    const { query } = createTestClientAndServer();
    spiedJwtVerification.mockResolvedValueOnce(true);
    await entryFactory({}, {}, 3);
    const LIST_ENTRY = gql`
      query {
        listEntry {
          edges {
            node {
              Guest {
                firstName
                lastName
                NIK
              }
              id
              see
              createdAt(format: "YYYY-MM-DD HH:MM")
              endedAt
            }
          }
        }
      }
    `;
    const res = await query({ query: LIST_ENTRY });
    expect(res.errors).toBeUndefined();
    expect(res.data.listEntry.edges).toHaveLength(3);
  });
});
