import gql from 'graphql-tag';
import Auth from '@aws-amplify/auth';
import { S3 } from 'aws-sdk';
import authUtil from '../../libs/auth';
import { createTestClientAndServer } from '../utils';

describe('Upload', () => {
  it('S3Sign: should work', async () => {
    const { query, uploadAPI } = createTestClientAndServer();
    const spiedSign = jest.spyOn(S3.prototype, 'getSignedUrl');
    const spiedAuthentication = jest
      .spyOn(authUtil, 'verifyJwt')
      .mockResolvedValue(true);
    const spiedService = jest.spyOn(uploadAPI, 'sign');
    const spiedCurrentUserInfo = jest.spyOn(Auth, 'currentUserInfo');

    spiedSign.mockResolvedValue('http://bucketname/user/file');

    const GET_SIGNED_REQUEST = gql`
      query GetSignRequest($fileName: String!, $fileType: String!) {
        s3Sign(fileName: $fileName, fileType: $fileType) {
          url
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
    expect(calls.length).toEqual(2);
    expect(calls[0][0]).toEqual('putObject');
    expect(calls[1][0]).toEqual('getObject');

    expect(spiedCurrentUserInfo).toBeCalled();

    expect(spiedService).toBeCalledWith(file);

    expect(spiedAuthentication).toBeCalled();

    expect(uploadAPI.sign).toBeCalled();
  });
});
