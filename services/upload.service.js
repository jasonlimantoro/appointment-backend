import { S3 } from 'aws-sdk';
import BaseService from './base';
import AWSConfiguration from '../config/aws-exports';

export default class UploadService extends BaseService {
  sign = async ({ fileName, fileType, permissionType = 'getObject' } = {}) => {
    const s3 = new S3();
    let params = {
      Bucket: AWSConfiguration.Storage.AWSS3.bucket,
      Key: fileName,
      Expires: 60,
    };
    if (permissionType === 'putObject') {
      params = {
        ...params,
        ContentType: fileType,
      };
    }
    const signedRequest = await s3.getSignedUrl(permissionType, params);
    return {
      signedRequest,
      key: params.Key,
    };
  };
}
