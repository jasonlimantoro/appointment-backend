import BaseService from './base';
import models from '../database/models';

class GuestService extends BaseService {
  constructor({ tableName = process.env.guestsTable } = {}) {
    super({ tableName });
  }

  list = async () => {
    const { guest } = models;
    return guest.findAll();
  };

  get = async id => {
    const { guest } = models;
    return guest.findByPk(id);
  };

  byName = async ({ firstName, lastName }) => {
    const { guest } = await models;
    return guest.findOne({ where: { firstName, lastName } });
  };

  getByIds = async ids => Promise.all(ids.map(id => this.get(id)));

  findOrCreate = async ({
    firstName, lastName, email, company, NIK,
  }) => {
    const existingData = await this.byName({ firstName, lastName });
    if (existingData) {
      return existingData;
    }
    const newData = await this.create({
      firstName,
      lastName,
      email,
      company,
      NIK,
    });
    return {
      ...newData,
      justCreated: true,
    };
  };

  create = async ({
    firstName, lastName, email, company, NIK,
  }) => {
    const { guest } = models;
    const { dataValues } = await guest.create({
      firstName,
      lastName,
      email,
      company,
      NIK,
    });
    return dataValues;
  };
}

export default GuestService;
