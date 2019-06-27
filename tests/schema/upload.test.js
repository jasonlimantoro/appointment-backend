import gql from 'graphql-tag';
import { S3 } from 'aws-sdk';
import authUtil from '../../libs/auth';
import * as datetimeUtils from '../../libs/datetime';
import { createTestClientAndServer } from '../utils';

describe('Upload', () => {
  it('S3Sign: should work', async () => {
    const { query, uploadAPI } = createTestClientAndServer();
    const spiedSign = jest
      .spyOn(S3.prototype, 'getSignedUrl')
      .mockResolvedValue('http://bucketname/user/file');
    const spiedAuthentication = jest
      .spyOn(authUtil, 'verifyJwt')
      .mockResolvedValue(true);
    const spiedService = jest.spyOn(uploadAPI, 'sign');
    const spiedHumanFormat = jest
      .spyOn(datetimeUtils, 'humanFormat')
      .mockReturnValue('some-unique-timestamp');

    const GET_SIGNED_REQUEST = gql`
      query GetSignRequest($fileName: String!, $fileType: String!) {
        s3Sign(fileName: $fileName, fileType: $fileType) {
          key
          signedRequest
        }
      }
    `;
    const file = {
      fileName: 'random-file.jpeg',
      fileType: 'image/jpeg',
    };
    const res = await query({
      query: GET_SIGNED_REQUEST,
      variables: { fileName: file.fileName, fileType: file.fileType },
    });
    expect(res).toMatchSnapshot();
    const { calls } = spiedSign.mock;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual('putObject');

    expect(spiedService).toBeCalledWith(file);

    expect(spiedHumanFormat).toBeCalled();

    expect(spiedAuthentication).toBeCalled();

    expect(uploadAPI.sign).toBeCalled();
  });
});
