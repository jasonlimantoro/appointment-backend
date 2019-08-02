import Sequelize from 'sequelize';
import config from '../../config/db';
import guest from './guest';
import entry from './entry';
import photo from './photo';

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
const dbConfig = config[env()];
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: 'mysql',
    host: dbConfig.host,
    logging: process.env.NODE_ENV !== 'test',
  },
);

const models = {
  guest: sequelize.import('guest', guest),
  entry: sequelize.import('entry', entry),
  photo: sequelize.import('photo', photo),
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
