import faker from 'faker';

import models from '../../database/models';

const data = async (props = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    userId: faker.random.uuid(),
    createdAt: faker.date.past(0.1),
  };
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}, options = {}, num = 1) => {
  const filled = await Promise.all(
    Array.from({ length: num }, () => data(props, options)),
  );
  const res = await models.session.bulkCreate(filled);
  if (num === 1) return res[0];
  return res;
};
