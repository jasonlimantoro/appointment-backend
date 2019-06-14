import AWS from 'aws-sdk';
import uuid from 'uuid';

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

  get(id) {
    return this.dataSource
      .get({
        TableName: this.tableName,
        Key: { id },
      })
      .promise()
      .then(r => r.Item);
  }

  create({ see, Guest, id }) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: id || uuid.v1(),
        see,
        Guest,
      },
    };
    return this.dataSource
      .put(params)
      .promise()
      .then(() => params.Item);
  }
}

export default EntryService;
