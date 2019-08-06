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
describe('endEntry', () => {
  it('should work', async () => {
    const { mutate } = createTestClientAndServer();
    const END_ENTRY = gql`
      mutation EndEntry($id: String!) {
        endEntry(id: $id) {
          id
          see
          createdAt
          endedAt
          status
        }
      }
    `;
    spiedJwtVerification.mockResolvedValueOnce(true);
    const entry = await entryFactory({}, { ended: false });
    const res = await mutate({
      mutation: END_ENTRY,
      variables: { id: entry.getDataValue('id') },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data.endEntry.status).toEqual('ENDED');
  });
});
