import gql from 'graphql-tag';
import { S3 } from 'aws-sdk';
import authUtil from '../../libs/auth';
import mockEntries from '../../fixtures/entries';
import mockGuests from '../../fixtures/guests';
import * as resolverUtils from '../../libs/resolverUtils';
import * as credentialUtils from '../../libs/credentials';
import Seeder from '../../libs/seeder';
import { createTestClientAndServer } from '../utils';

const spiedAuthentication = jest
  .spyOn(authUtil, 'verifyJwt')
  .mockRejectedValue(new Error());

const spiedSign = jest
  .spyOn(S3.prototype, 'getSignedUrl')
  .mockResolvedValue('http://bucketname/user/file');

const spiedGetServiceWithAssumedCredentials = jest
  .spyOn(credentialUtils, 'getServiceWithAssumedCredentials')
  .mockResolvedValue(true);

afterEach(() => {
  spiedAuthentication.mockClear();
  spiedSign.mockClear();
  spiedGetServiceWithAssumedCredentials.mockClear();
});

describe('Upload', () => {
  it('S3Sign: should work for putObject signing', async () => {
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

    spiedAuthentication.mockResolvedValueOnce(true);
    const spiedService = jest.spyOn(uploadAPI, 'sign').mockResolvedValueOnce({
      key: 'some-key',
      signedRequest: 'signed-url',
    });
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
      query GetSignRequest($input: S3SignGuestPhotoInput!) {
        s3SignUploadGuestPhoto(input: $input) {
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
    // const { calls } = spiedSign.mock;
    // expect(calls.length).toEqual(1);
    // expect(calls[0][0]).toEqual('putObject');
    // expect(calls[0][1]).toMatchObject({
    //   Bucket: expect.any(String),
    //   ContentType: file.fileType,
    //   Key: 'some-file-name',
    // });

    expect(spiedEntryAPIGet).toBeCalledWith(file.entryId);
    expect(spiedGuestAPIGet).toBeCalledWith(mockEntries[2].guestId);

    expect(spiedService).toBeCalledWith({
      fileType: file.fileType,
      fileName: 'some-file-name',
      permissionType: 'putObject',
    });

    expect(spiedConstructFileName).toBeCalledWith({
      prefix: `${mockGuests[0].NIK}-${mockGuests[0].firstName}-${
        mockGuests[0].lastName
      }`,
      fileName: file.fileName,
      fileType: file.fileType,
    });

    expect(spiedAuthentication).toBeCalled();
  });
  it('S3Sign: should work for getObject signing', async () => {
    const { query, uploadAPI } = createTestClientAndServer();
    const { key } = Seeder.photo();
    spiedAuthentication.mockResolvedValueOnce(true);
    const spiedService = jest.spyOn(uploadAPI, 'sign').mockResolvedValue({
      key: 'some-key',
      signedRequest: 'signed-url',
    });

    const GET_SIGNED_REQUEST = gql`
      query GetSignRequest($key: String!) {
        s3SignGetGuestPhoto(key: $key) {
          key
          signedRequest
        }
      }
    `;
    const res = await query({
      query: GET_SIGNED_REQUEST,
      variables: { key },
    });
    expect(res).toMatchSnapshot();
    // const { calls } = spiedSign.mock;
    // expect(calls.length).toEqual(1);
    // expect(calls[0][0]).toEqual('getObject');
    // expect(calls[0][1]).toMatchObject({
    //   Bucket: expect.any(String),
    //   Key: key,
    // });

    expect(spiedService).toBeCalledWith({
      fileName: key,
      permissionType: 'getObject',
    });

    expect(spiedAuthentication).toBeCalled();
  });
});
