import uuid from 'uuid';
import moment from 'moment';
import { humanFormat, commonFormat } from '../libs/datetime';

import BaseService from './base';

class EntryService extends BaseService {
  static invalidArgumentsError = new Error('Invalid Argument');

  constructor({ tableName = process.env.entriesTable } = {}) {
    super({ tableName });
  }

  list = ({ first, after } = {}) => this._util.list({
    ...(after && { ExclusiveStartKey: { id: after } }),
    Limit: first,
  });

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

  end = async id => this._util.update({
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

  byGuestId = ({ id, first, after }) => this._util.where({
    IndexName: 'guestId-index',
    KeyConditionExpression: 'guestId = :guestId',
    ExpressionAttributeValues: {
      ':guestId': id,
    },
    ExclusiveStartKey: after,
    Limit: first,
    ScanIndexForward: false,
  });

  createdAt = creationDate => this._util.where({
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
