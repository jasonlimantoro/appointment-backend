import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory } from '../../factories';
import models from '../../../database/models';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
beforeEach(async () => {
  await truncateDb();
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
afterAll(async () => {
  await models.sequelize.close();
});
describe('listOnGoingEntry', () => {
  it('should work', async () => {
    const { query } = createTestClientAndServer();
    await entryFactory({}, { ended: true }, 3);
    await entryFactory({}, { ended: false }, 2);
    const LIST_ONGOING = gql`
      query {
        listOngoingEntry {
          edges {
            node {
              see
              id
              createdAt
            }
          }
          pagination {
            hasNext
            count
          }
        }
      }
    `;
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({ query: LIST_ONGOING });
    expect(res.errors).toBeUndefined();
    expect(res.data.listOngoingEntry.edges).toHaveLength(2);
  });
});
