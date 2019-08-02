import gql from 'graphql-tag';
import mockEntries from '../../fixtures/entries';
import { createTestClientAndServer } from '../utils';
import Seeder from '../../libs/seeder';
import Auth from '../../libs/auth';
import * as credentialUtils from '../../libs/credentials';

const spiedJWTVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

beforeEach(() => {
  spiedJWTVerification.mockRejectedValue(
    new Error('Authenticated routes should be protected'),
  );
});
afterEach(() => {
  spiedJWTVerification.mockClear();
});
describe('photo', () => {
  it('photoByEntryId: should work', async () => {
    const { query, photoAPI } = createTestClientAndServer();

    const photo = Seeder.photo(mockEntries[0].id, 'some-date-now');
    const spiedService = jest
      .spyOn(photoAPI, 'byEntry')
      .mockResolvedValue([photo]);
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
      variables: { entryId: mockEntries[0].id },
    });
    expect(res).toMatchSnapshot();
    expect(spiedService).toBeCalledWith(mockEntries[0].id);
  });
});
