import uuid from 'uuid';
import BaseService from './base';
import dynamoClient from '../config/dynamodb';

class SessionService extends BaseService {
  constructor({
    tableName = process.env.sessionsTable,
    dataSource = dynamoClient,
  } = {}) {
    super();
    this.tableName = tableName;
    this.dataSource = dataSource;
  }

  create = async ({ userId } = {}) => {
    if (!userId) {
      this.constructor.throwInvalidArgumentsError();
    }
    const params = {
      TableName: this.tableName,
      Item: {
        id: uuid.v1(),
        userId,
        createdAt: new Date().toLocaleString(),
      },
    };
    return this.dataSource
      .put(params)
      .promise()
      .then(() => params.Item);
  };

  end = async ({ id } = {}) => {
    if (!id) {
      this.constructor.throwInvalidArgumentsError();
    }
    return this.dataSource
      .update({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'set endedAt = :now',
        ExpressionAttributeValues: {
          ':now': new Date().toLocaleString(),
        },
        ReturnValues: 'ALL_NEW',
      })
      .promise()
      .then(r => r.Attributes);
  };
}

export default SessionService;
