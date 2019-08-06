import gql from 'graphql-tag';
import { createTestClientAndServer, truncateDb } from '../../utils';
import Auth from '../../../libs/auth';
import { entryFactory, photoFactory } from '../../factories';
import * as credentialUtils from '../../../libs/credentials';
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
describe('Entry Schema', () => {
  it('Entry can automatically sign the photos url', async () => {
    const { query } = createTestClientAndServer();
    const entry = await entryFactory({}, { ended: false });
    await photoFactory({ entryId: entry.getDataValue('id') }, {}, 2);
    const QUERY = gql`
      query {
        listOngoingEntry {
          edges {
            node {
              see
              id
              photo {
                signedUrl(permissions: [GET]) {
                  get
                }
              }
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
    const res = await query({ query: QUERY });
    expect(res.errors).toBeUndefined();
    expect(res.data.listOngoingEntry.edges[0].node.photo).toHaveLength(2);
  });
});
