import uuid from 'uuid';
import dynamoClient from '../config/dynamodb';

import BaseService from './base';

class EntryService extends BaseService {
  static invalidArgumentsError = new Error('Invalid Argument');

  constructor({
    mockedData,
    mocked,
    tableName = process.env.entriesTable,
    dataSource = dynamoClient,
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

  create({ see, guestId, id }) {
    if (!guestId) {
      throw this.constructor.invalidArgumentsError;
    }
    const params = {
      TableName: this.tableName,
      Item: {
        id: id || uuid.v1(),
        see,
        guestId,
        createdAt: new Date().toLocaleString(),
      },
    };
    return this.dataSource
      .put(params)
      .promise()
      .then(() => params.Item);
  }

  end(id) {
    return this.dataSource
      .update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'set endedAt = :now',
        ExpressionAttributeValues: {
          ':now': new Date().toLocaleString(),
        },
        ConditionExpression: 'attribute_not_exists(endedAt)',
        ReturnValues: 'ALL_NEW',
      })
      .promise()
      .then(r => r.Attributes);
  }
}

export default EntryService;
