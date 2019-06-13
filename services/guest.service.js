import uuid from 'uuid';
import AWS from 'aws-sdk';

import BaseService from './base';

class GuestService extends BaseService {
  constructor({ mockedData = [], mocked = false, tableName = process.env.guestsTable } = {}) {
    super({ mockedData, mocked });
    this.dataSource = new AWS.DynamoDB.DocumentClient();
    this.tableName = tableName;
  }

  list() {
    return this.mockedData;
  }

  get(id) {
    return this.list().find(d => d.id === id);
  }

  byName(body) {
    return this.dataSource
      .query({
        TableName: this.tableName,
        IndexName: 'firstName-index',
        KeyConditionExpression: 'firstName = :firstName',
        FilterExpression: 'lastName = :lastName',
        ExpressionAttributeValues: {
          ':firstName': body.firstName,
          ':lastName': body.lastName,
        },
      })
      .promise()
      .then(response => response.Items[0]);
  }

  create(body) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: uuid.v1(),
        ...body,
      },
    };
    return this.dataSource
      .put(params)
      .promise()
      .then(() => params.Item);
  }
}

export default GuestService;
