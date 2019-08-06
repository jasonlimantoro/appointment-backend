import uuid from 'uuid';
import BaseService from './base';
import dynamoClient from '../config/dynamodb';
import { humanFormat } from '../libs/datetime';
import models from '../database/models';

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
    const { session } = models;
    const res = await session.create({ id: uuid.v4(), userId });
    return res;
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
          ':now': humanFormat(new Date()),
        },
        ConditionExpression:
          'attribute_not_exists(endedAt) AND attribute_exists(id)',
        ReturnValues: 'ALL_NEW',
      })
      .promise()
      .then(r => r.Attributes);
  };
}

export default SessionService;
