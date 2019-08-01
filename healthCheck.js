import models from './database/models';

const handler = async () => {
  await models.sequelize.sync();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'connection to Amazon Aurora successful',
    }),
  };
};

export { handler };
