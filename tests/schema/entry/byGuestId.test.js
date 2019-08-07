import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory, guestFactory } from '../../factories';
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
describe('byGuestId', () => {
  it('should work', async () => {
    const { query } = createTestClientAndServer();
    const john = await guestFactory({ firstName: 'John' });
    await entryFactory(
      {
        guestId: john.getDataValue('NIK'),
      },
      {},
      2,
    );
    await entryFactory({}, {}, 3);
    const BY_GUEST_ID = gql`
      query byGuestId($NIK: String!) {
        byGuestId(NIK: $NIK) {
          id
          see
          createdAt
          Guest {
            NIK
          }
        }
      }
    `;
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({
      query: BY_GUEST_ID,
      variables: { NIK: john.getDataValue('NIK') },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.byGuestId).toHaveLength(2);
  });
});
