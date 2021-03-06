import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory } from '../../factories';
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
describe('getEntry', () => {
  it('should work', async () => {
    const { query } = createTestClientAndServer();
    const entry = await entryFactory();
    const GET_ENTRY = gql`
      query GetEntry($id: String!) {
        getEntry(id: $id) {
          id
          see
          createdAt
          endedAt
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const res = await query({
      query: GET_ENTRY,
      variables: { id: entry.getDataValue('id') },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.getEntry.id).toEqual(entry.getDataValue('id'));
  });
});
