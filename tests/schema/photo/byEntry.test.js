import gql from 'graphql-tag';
import { createTestClientAndServer } from '../../utils';
import Auth from '../../../libs/auth';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory, photoFactory } from '../../factories';
import '../../dbHooks';

const spiedJWTVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

beforeEach(async () => {
  spiedJWTVerification.mockRejectedValue(
    new Error('Authenticated routes should be protected'),
  );
});
afterEach(() => {
  spiedJWTVerification.mockClear();
});
describe('byEntry', () => {
  it('should work', async () => {
    const { query } = createTestClientAndServer();
    const entry = await entryFactory();
    await photoFactory({ entryId: entry.getDataValue('id') }, {}, 3);
    await photoFactory({}, {}, 2);

    const PHOTO_BY_ENTRY = gql`
      query PhotoByEntry($entryId: String!) {
        photoByEntry(entryId: $entryId) {
          id
          key
        }
      }
    `;
    spiedJWTVerification.mockResolvedValue(true);
    const res = await query({
      query: PHOTO_BY_ENTRY,
      variables: { entryId: entry.getDataValue('id') },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.photoByEntry).toHaveLength(3);
  });
});
