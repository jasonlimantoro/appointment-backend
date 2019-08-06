import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import models from '../../../database/models';
import { entryFactory } from '../../factories';

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
