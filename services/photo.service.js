import uuid from 'uuid';
import { humanFormat } from '../libs/datetime';
import BaseService from './base';
import models from '../database/models';

export default class PhotoService extends BaseService {
  constructor({ tableName = process.env.photosTable } = {}) {
    super({ tableName });
  }

  create = ({ key, entryId, id } = {}) =>
    this._util.put({
      Item: {
        id: id || uuid.v1(),
        key,
        entryId,
        createdAt: humanFormat(new Date()),
      },
    });

  byEntry = async entryId => {
    const { photo } = models;
    const res = await photo.findAll({
      where: {
        entryId,
      },
    });
    return res;
  };
}
