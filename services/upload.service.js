import { S3 } from 'aws-sdk';
import Auth from '@aws-amplify/auth';
import { getNestedObjectValue } from 'appointment-common';
import BaseService from './base';
import AWSConfiguration from '../config/aws-exports';

export default class UploadService extends BaseService {
  sign = async ({ fileName, fileType }) => {
    const res = await Auth.currentUserInfo();
    const sub = getNestedObjectValue(res)(['attributes', 'sub']);
    const uniqueFileName = `${new Date().toISOString()}-${fileName}`;
    const s3 = new S3();
    const params = {
      Bucket: AWSConfiguration.Storage.AWSS3.bucket,
      Key: `${sub}/${uniqueFileName}`,
      ContentType: fileType,
    };
    const signedRequest = await s3.getSignedUrl('putObject', params);
    const url = await s3.getSignedUrl('getObject', {
      Bucket: params.Bucket,
      Key: params.Key,
    });
    return {
      signedRequest,
      url,
    };
  };
}
