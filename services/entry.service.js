import uuid from 'uuid';
import { humanFormat, startDay, endDay } from '../libs/datetime';
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
          [models.Sequelize.Op.between]: [startDay, endDay],
        },
        ...(guestId && { guestId }),
      },
    });
    return res;
  };

  get = async id => {
    const { entry } = models;
    const res = await entry.findByPk(id);
    return res;
  };

  create = async ({
    see, guestId, id, sessionId,
  }) => {
    if (!guestId) {
      this.constructor.throwInvalidArgumentsError('guestID must be provided');
    }
    const { entry } = models;
    return entry.create({
      id: id || uuid.v4(),
      see,
      guestId,
      sessionId,
    });
  };

  end = async id => {
    const { entry } = models;
    await entry.update(
      {
        endedAt: humanFormat(new Date()),
        status: 'ENDED',
      },
      {
        where: {
          id,
        },
      },
    );
    return entry.findByPk(id);
  };

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
    const { entry } = models;
    return entry.findAll({
      where: {
        status: 'ONGOING',
      },
    });
  };
}

export default EntryService;
