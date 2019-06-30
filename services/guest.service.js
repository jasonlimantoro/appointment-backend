import BaseService from './base';

class GuestService extends BaseService {
  constructor({ tableName = process.env.guestsTable } = {}) {
    super({ tableName });
  }

  list = async () => this._util.list();

  get = async id => this._util.get({
    Key: { NIK: id },
  });

  byName = async ({ firstName, lastName }) => {
    const res = await this._util.where({
      IndexName: 'firstName-index',
      KeyConditionExpression: 'firstName = :firstName AND lastName = :lastName',
      ExpressionAttributeValues: {
        ':firstName': firstName,
        ':lastName': lastName,
      },
    });
    return res[0];
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
  }) => this._util.put({
    Item: {
      firstName,
      lastName,
      email,
      company,
      NIK,
    },
  });
}

export default GuestService;
