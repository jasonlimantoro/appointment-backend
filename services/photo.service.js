import uuid from 'uuid';
import BaseService from './base';
import models from '../database/models';

export default class PhotoService extends BaseService {
  constructor({ tableName = process.env.photosTable } = {}) {
    super({ tableName });
  }

  create = async ({ key, entryId, id } = {}) => {
    const { photo } = models;
    const res = await photo.create({ key, entryId, id: id || uuid.v4() });
    return res;
  };

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
