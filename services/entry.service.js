import uuid from 'uuid';
import moment from 'moment';
import { humanFormat, commonFormat } from '../libs/datetime';
import models from '../database/models';

import BaseService from './base';

class EntryService extends BaseService {
  static invalidArgumentsError = new Error('Invalid Argument');

  constructor({ tableName = process.env.entriesTable } = {}) {
    super({ tableName });
  }

  list = async () => {
    const { entry } = models;
    const res = await entry.findAll();
    return res;
  };

  today = async ({ guestId } = {}) => {
    const { entry } = models;
    const res = await entry.findAll({
      where: {
        createdAt: {
          [models.Sequelize.Op.between]: [
            moment()
              .hours(0)
              .minutes(0)
              .seconds(0),
            moment()
              .hours(23)
              .minutes(59)
              .seconds(59),
          ],
        },
        ...(guestId && { guestId }),
      },
    });
    return res;
  };

  get = id => this._util.get({ key: { id } });

  create = async ({
    see, guestId, id, userId,
  }) => {
    if (!guestId) {
      this.constructor.throwInvalidArgumentsError('guestID must be provided');
    }
    return this._util.put({
      Item: {
        id: id || uuid.v1(),
        see,
        guestId,
        userId,
        status: 'ONGOING',
        createdAt: humanFormat(new Date()),
      },
    });
  };

  end = async id =>
    this._util.update({
      Key: { id },
      UpdateExpression: 'set endedAt = :now, #stats = :finished',
      ExpressionAttributeNames: {
        '#stats': 'status',
      },
      ExpressionAttributeValues: {
        ':now': humanFormat(new Date()),
        ':finished': 'FINISHED',
      },
      ConditionExpression: 'attribute_not_exists(endedAt)',
      ReturnValues: 'ALL_NEW',
    });

  byGuestId = ({ id }) => models.entry.findAll({ where: { guestId: id } });

  createdAt = creationDate =>
    this._util.where({
      IndexName: 'status-index',
      KeyConditionExpression: '#stats = :onGoing AND createdAt = :creationDate',
      ExpressionAttributeNames: {
        '#stats': 'status',
      },
      ExpressionAttributeValues: {
        ':onGoing': 'FINISHED',
        ':creationDate': creationDate,
      },
    });

  onGoing = () => {
    const midnight = moment()
      .hours(0)
      .minutes(0)
      .format(commonFormat);
    const later = moment()
      .hours(23)
      .minutes(59)
      .format(commonFormat);
    return this._util.where({
      IndexName: 'status-index',
      KeyConditionExpression:
        '#stats = :onGoing AND createdAt BETWEEN :start AND :end',
      ExpressionAttributeNames: {
        '#stats': 'status',
      },
      ExpressionAttributeValues: {
        ':start': midnight,
        ':end': later,
        ':onGoing': 'ONGOING',
      },
      ScanIndexForward: false,
    });
  };
}

export default EntryService;
