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
}

export default SessionService;
