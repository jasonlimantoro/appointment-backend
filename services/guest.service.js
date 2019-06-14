import uuid from 'uuid';
import AWS from 'aws-sdk';

import BaseService from './base';

class GuestService extends BaseService {
  constructor({
    mockedData = [],
    mocked = false,
    tableName = process.env.guestsTable,
    dataSource = new AWS.DynamoDB.DocumentClient(),
  } = {}) {
    super({ mockedData, mocked });
    this.dataSource = dataSource;
    this.tableName = tableName;
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

  byName({ firstName, lastName }) {
    return this.dataSource
      .query({
        TableName: this.tableName,
        IndexName: 'firstName-index',
        KeyConditionExpression: 'firstName = :firstName',
        FilterExpression: 'lastName = :lastName',
        ExpressionAttributeValues: {
          ':firstName': firstName,
          ':lastName': lastName,
        },
      })
      .promise()
      .then(response => response.Items[0]);
  }

  async getByIds(ids) {
    return Promise.all(ids.map(id => this.get(id)));
  }

  async findOrCreate({
    firstName, lastName, email, company, NIK, id,
  }) {
    const existingData = await this.byName({ firstName, lastName });
    if (existingData) {
      return existingData;
    }
    const newData = await this.create({
      firstName,
      lastName,
      email,
      company,
      NIK,
      id,
    });
    return {
      ...newData,
      justCreated: true,
    };
  }

  create({
    firstName, lastName, email, company, NIK, id,
  }) {
    const params = {
      TableName: this.tableName,
      Item: {
        id: id || uuid.v1(),
        firstName,
        lastName,
        email,
        company,
        NIK,
      },
    };
    return this.dataSource
      .put(params)
      .promise()
      .then(() => params.Item);
  }
}

export default GuestService;
