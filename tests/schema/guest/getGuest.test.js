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

  it('getGuest: should work', async () => {
    const { query } = createTestClientAndServer();
    const john = await guestFactory({ firstName: 'John' });
    const GET_GUEST = gql`
      query guest($NIK: String!) {
        getGuest(NIK: $NIK) {
          NIK
          firstName
          lastName
          email
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const result = await query({
      query: GET_GUEST,
      variables: { NIK: john.getDataValue('NIK') },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data.getGuest.NIK).toEqual(john.NIK);
  });
});
