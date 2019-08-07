import faker from 'faker';

import models from '../../database/models';

const data = async (props = {}, options = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    userId: faker.random.uuid(),
    createdAt: faker.date.past(0.1),
    endedAt: faker.date.future(0.1),
  };
  const { ended } = options;
  // randomize if options.ended is unspecified
  const isEnded = ended === undefined ? faker.random.arrayElement([true, false]) : ended;
  const statefulProps = {
    ...(isEnded
      ? {}
      : {
        endedAt: null,
      }),
  };
  return Object.assign({}, defaultProps, statefulProps, props);
};

export default async (props = {}, options = {}, num = 1) => {
  const filled = await Promise.all(
    Array.from({ length: num }, () => data(props, options)),
  );
  const res = await models.session.bulkCreate(filled);
  if (num === 1) return res[0];
  return res;
};
