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
    const { session } = models;
    const res = await session.create({ id: uuid.v4(), userId });
    return res;
  };

  end = async ({ id } = {}) => {
    const { session } = models;
    await session.update(
      { endedAt: humanFormat(new Date()) },
      { where: { id } },
    );
    return session.findByPk(id);
  };
}

export default SessionService;
