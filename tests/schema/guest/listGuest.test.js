import gql from 'graphql-tag';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import Auth from '../../../libs/auth';
import { entryFactory, guestFactory } from '../../factories';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

describe('Guest schema', () => {
  beforeEach(async () => {
    spiedJwtVerification.mockRejectedValue(
      new Error('Authenticated routes should be protected'),
    );
    await truncateDb();
  });
  afterEach(async () => {
    spiedJwtVerification.mockClear();
    await truncateDb();
  });
  it('listGuest: should work', async () => {
    const { query } = createTestClientAndServer();
    const jane = await guestFactory({ firstName: 'Jane' });
    await guestFactory({ firstName: 'John' });
    const entry = await entryFactory({ guestId: jane.getDataValue('NIK') });
    const LIST_GUEST = gql`
      query guests {
        listGuest {
          NIK
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
    spiedJwtVerification.mockResolvedValue(true);
    const result = await query({ query: LIST_GUEST });
    expect(result.data.listGuest).toHaveLength(2);
    expect(result.data.listGuest[0].entryToday[0].id).toEqual(entry.id);
    expect(result.errors).toBeUndefined();
  });
});
