import uuid from 'uuid';
import dynamoClient from '../config/dynamodb';
import { humanFormat } from '../libs/datetime';

import BaseService from './base';

class EntryService extends BaseService {
  static invalidArgumentsError = new Error('Invalid Argument');

  constructor({
    tableName = process.env.entriesTable,
    dataSource = dynamoClient,
  } = {}) {
    super();
    this.tableName = tableName;
    this.dataSource = dataSource;
  }

  list = async () => this.dataSource
    .scan({
      TableName: this.tableName,
    })
    .promise()
    .then(r => r.Items);

  get = id => this.dataSource
    .get({
      TableName: this.tableName,
      Key: { id },
    })
    .promise()
    .then(r => r.Item);

  create = async ({ see, guestId, id }) => {
    if (!guestId) {
      this.constructor.throwInvalidArgumentsError('guestID must be provided');
    }
    const params = {
      TableName: this.tableName,
      Item: {
        id: id || uuid.v1(),
        see,
        guestId,
        createdAt: humanFormat(new Date()),
      },
    };
    return this.dataSource
      .put(params)
      .promise()
      .then(() => params.Item);
  };

  end = async id => this.dataSource
    .update({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'set endedAt = :now',
      ExpressionAttributeValues: {
        ':now': humanFormat(new Date()),
      },
      ConditionExpression: 'attribute_not_exists(endedAt)',
      ReturnValues: 'ALL_NEW',
    })
    .promise()
    .then(r => r.Attributes);

  byGuestId = id => this.dataSource
    .query({
      TableName: this.tableName,
      IndexName: 'guestId-index',
      KeyConditionExpression: 'guestId = :guestId',
      ExpressionAttributeValues: {
        ':guestId': id,
      },
      ScanIndexForward: false,
    })
    .promise()
    .then(r => r.Items);
}

export default EntryService;
