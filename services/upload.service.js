import AWS from 'aws-sdk';
import BaseService from './base';
import AWSConfiguration from '../config/aws-exports';

export default class UploadService extends BaseService {
  createSignature = (permission, params) => new Promise((resolve, reject) => {
    const s3 = new AWS.S3();
    s3.getSignedUrl(permission, params, (error, url) => {
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });

  sign = async ({ fileName, fileType, permissionType = 'getObject' } = {}) => {
    let params = {
      Bucket: AWSConfiguration.Storage.AWSS3.bucket,
      Key: fileName,
      Expires: 500,
    };
    if (permissionType === 'putObject') {
      params = {
        ...params,
        ContentType: fileType,
      };
    }
    const signedRequest = await this.createSignature(permissionType, params);
    return {
      signedRequest,
      key: params.Key,
    };
  };
}
