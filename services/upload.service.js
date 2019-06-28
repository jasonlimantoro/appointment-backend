import { S3 } from 'aws-sdk';
import BaseService from './base';
import AWSConfiguration from '../config/aws-exports';

export default class UploadService extends BaseService {
  sign = async ({ fileName, fileType }) => {
    const s3 = new S3();
    const params = {
      Bucket: AWSConfiguration.Storage.AWSS3.bucket,
      Key: fileName,
      ContentType: fileType,
    };
    const signedRequest = await s3.getSignedUrl('putObject', params);
    return {
      signedRequest,
      key: params.Key,
    };
  };
}
