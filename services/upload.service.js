import { S3 } from 'aws-sdk';
import BaseService from './base';
import AWSConfiguration from '../config/aws-exports';
import { humanFormat } from '../libs/datetime';

export default class UploadService extends BaseService {
  sign = async ({ fileName: filePath, fileType }) => {
    const uniqueFileName = `${humanFormat(new Date())}`;
    const s3 = new S3();
    const params = {
      Bucket: AWSConfiguration.Storage.AWSS3.bucket,
      Key: `${filePath}/${uniqueFileName}`,
      ContentType: fileType,
    };
    const signedRequest = await s3.getSignedUrl('putObject', params);
    return {
      signedRequest,
      key: params.Key,
    };
  };
}
