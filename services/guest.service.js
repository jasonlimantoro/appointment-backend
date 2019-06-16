import uuid from 'uuid';
import dynamoClient from '../config/dynamodb';

import BaseService from './base';

class GuestService extends BaseService {
  constructor({
    tableName = process.env.guestsTable,
    dataSource = dynamoClient,
  } = {}) {
    super();
    this.dataSource = dataSource;
    this.tableName = tableName;
  }

  list = async () => this.dataSource
    .scan({
      TableName: this.tableName,
    })
    .promise()
    .then(r => r.Items);

  get = async id => this.dataSource
    .get({
      TableName: this.tableName,
      Key: { id },
    })
    .promise()
    .then(r => r.Item);

  byName = async ({ firstName, lastName }) => this.dataSource
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

  getByIds = async ids => Promise.all(ids.map(id => this.get(id)));

  findOrCreate = async ({
    firstName, lastName, email, company, NIK, id,
  }) => {
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
  };

  create = async ({
    firstName, lastName, email, company, NIK, id,
  }) => {
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
  };
}

export default GuestService;
