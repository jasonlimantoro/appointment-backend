import gql from 'graphql-tag';
import _ from 'lodash';
import { createTestClientAndServer, truncateDb } from '../utils';
import {
  entries as mockedEntries,
  photos as mockedPhotos,
} from '../../fixtures';
import Auth from '../../libs/auth';
import * as credentialUtils from '../../libs/credentials';

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
describe('Entry Schema', () => {
  it('Entry can automatically sign the photos url', async () => {
    const {
      query,
      entryAPI,
      uploadAPI,
      photoAPI,
    } = createTestClientAndServer();
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
    uploadAPI.sign = jest
      .fn()
      .mockResolvedValue({ signedRequest: 'signed-request-for-get' });
    entryAPI.onGoing = jest
      .fn()
      .mockResolvedValue({ Items: _.take(mockedEntries, 2), Count: 2 });
    photoAPI.byEntry = jest.fn().mockResolvedValue(_.take(mockedPhotos, 2));
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({ query: QUERY });
    expect(res.errors).toBeUndefined();
    expect(uploadAPI.sign).toBeCalled();
  });
});
