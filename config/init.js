import AWS from 'aws-sdk';

if (AWS.config.credentials.needsRefresh()) {
  AWS.config.credentials.refreshPromise();
}
