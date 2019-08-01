import Sequelize from 'sequelize';
import GuestModel from './models/guest';
import config from '../config/db';

const env = () => {
  switch (true) {
    case !!process.env.IS_OFFLINE:
      return 'local';
    case process.env.NODE_ENV === 'test':
      return 'test';
    default:
      return 'development';
  }
};

const conf = config[env()];
const sequelize = new Sequelize(conf.database, conf.username, conf.password, {
  dialect: 'mysql',
  host: conf.host,
  logging: false,
});
const Guest = GuestModel(sequelize, Sequelize);
const Models = { Guest };
const connection = {};

/**
 * @deprecated In favor of new model structure in database/models
 */
const connectToDb = async () => {
  if (connection.isConnected) {
    console.log('=> using existing connection');
    return Models;
  }
  await sequelize.sync();
  await sequelize.authenticate();
  connection.isConnected = true;
  console.log('=> using a new connection');
  return Models;
};

export default connectToDb;
