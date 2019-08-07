import gql from 'graphql-tag';
import { createTestClientAndServer, truncateDb } from '../../utils';
import Auth from '../../../libs/auth';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory, photoFactory } from '../../factories';
import models from '../../../database/models';

const spiedJWTVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

beforeEach(async () => {
  await truncateDb();
  spiedJWTVerification.mockRejectedValue(
    new Error('Authenticated routes should be protected'),
  );
});
afterEach(() => {
  spiedJWTVerification.mockClear();
});
afterAll(async () => {
  await models.sequelize.close();
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
