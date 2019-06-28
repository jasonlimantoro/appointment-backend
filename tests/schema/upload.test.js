import gql from 'graphql-tag';
import { S3 } from 'aws-sdk';
import authUtil from '../../libs/auth';
import mockEntries from '../../fixtures/entries';
import mockGuests from '../../fixtures/guests';
import * as resolverUtils from '../../libs/resolverUtils';
import { createTestClientAndServer } from '../utils';

describe('Upload', () => {
  it('S3Sign: should work', async () => {
    const {
      query,
      uploadAPI,
      entryAPI,
      guestAPI,
    } = createTestClientAndServer();
    const file = {
      fileName: 'random-file',
      fileType: 'image/jpeg',
      entryId: mockEntries[2].id,
    };

    const spiedSign = jest
      .spyOn(S3.prototype, 'getSignedUrl')
      .mockResolvedValue('http://bucketname/user/file');
    const spiedAuthentication = jest
      .spyOn(authUtil, 'verifyJwt')
      .mockResolvedValue(true);
    const spiedService = jest.spyOn(uploadAPI, 'sign');
    const spiedEntryAPIGet = jest
      .spyOn(entryAPI, 'get')
      .mockResolvedValue(mockEntries[2]);
    const spiedGuestAPIGet = jest
      .spyOn(guestAPI, 'get')
      .mockResolvedValue(mockGuests[0]);

    const spiedConstructFileName = jest
      .spyOn(resolverUtils, 'constructFileName')
      .mockReturnValue('some-file-name');

    const GET_SIGNED_REQUEST = gql`
      query GetSignRequest($input: S3SignInput!) {
        s3Sign(input: $input) {
          key
          signedRequest
        }
      }
    `;
    const res = await query({
      query: GET_SIGNED_REQUEST,
      variables: {
        input: {
          fileName: file.fileName,
          fileType: file.fileType,
          entryId: file.entryId,
        },
      },
    });
    expect(res).toMatchSnapshot();
    const { calls } = spiedSign.mock;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual('putObject');

    expect(spiedEntryAPIGet).toBeCalledWith(file.entryId);
    expect(spiedGuestAPIGet).toBeCalledWith(mockEntries[2].guestId);

    expect(spiedService).toBeCalledWith({
      fileType: file.fileType,
      fileName: 'some-file-name',
    });

    expect(spiedConstructFileName).toBeCalledWith({
      prefix: `${mockGuests[0].NIK}-${mockGuests[0].firstName}-${
        mockGuests[0].lastName
      }`,
      fileName: file.fileName,
      fileType: file.fileType,
    });

    expect(spiedAuthentication).toBeCalled();

    expect(uploadAPI.sign).toBeCalled();
  });
});
