import AWS from 'aws-sdk';

import BaseService from './base';

class EntryService extends BaseService {
  constructor({
    mockedData,
    mocked,
    tableName = process.env.entriesTable,
    dataSource = new AWS.DynamoDB.DocumentClient(),
  } = {}) {
    super({ mockedData, mocked });
    this.tableName = tableName;
    this.dataSource = dataSource;
  }

  list() {
    return this.dataSource
      .scan({
        TableName: this.tableName,
      })
      .promise()
      .then(r => r.Items);
  }
}

export default EntryService;
