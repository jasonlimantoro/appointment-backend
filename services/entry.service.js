import uuid from 'uuid';
import { humanFormat } from '../libs/datetime';

import BaseService from './base';

class EntryService extends BaseService {
  static invalidArgumentsError = new Error('Invalid Argument');

  constructor({ tableName = process.env.entriesTable } = {}) {
    super({ tableName });
  }

  list = () => this._util.list();

  get = id => this._util.get({ key: { id } });

  create = async ({ see, guestId, id }) => {
    if (!guestId) {
      this.constructor.throwInvalidArgumentsError('guestID must be provided');
    }
    return this._util.put({
      Item: {
        id: id || uuid.v1(),
        see,
        guestId,
        createdAt: humanFormat(new Date()),
      },
    });
  };

  end = async id => this._util.update({
    Key: { id },
    UpdateExpression: 'set endedAt = :now',
    ExpressionAttributeValues: {
      ':now': humanFormat(new Date()),
    },
    ConditionExpression: 'attribute_not_exists(endedAt)',
    ReturnValues: 'ALL_NEW',
  });

  byGuestId = id => this._util.where({
    IndexName: 'guestId-index',
    KeyConditionExpression: 'guestId = :guestId',
    ExpressionAttributeValues: {
      ':guestId': id,
    },
    ScanIndexForward: false,
  });
}

export default EntryService;
