import gql from 'graphql-tag';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import Auth from '../../../libs/auth';
import { guestFactory } from '../../factories';

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

  it('byName: should work', async () => {
    const { query } = createTestClientAndServer();
    const guest = await guestFactory({ firstName: 'John', lastName: 'Doe' });
    const BY_NAME = gql`
      query guestByName($input: ByNameInput!) {
        byName(input: $input) {
          NIK
          firstName
          lastName
          email
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const result = await query({
      query: BY_NAME,
      variables: { input: { firstName: 'John', lastName: 'Doe' } },
    });
    expect(result.data.byName.NIK).toEqual(guest.NIK);
    expect(result.errors).toBeUndefined();
  });
});
