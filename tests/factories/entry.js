import faker from 'faker';

import models from '../../database/models';

const data = (props = {}, options = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    see: faker.name.findName(),
    status: faker.random.arrayElement(['ONGOING', 'ENDED']),
    guestId: faker.finance.account(16),
    endedAt: faker.date.future(0.1),
  };
  const { ended } = options;
  // randomize if options.ended is unspecified
  const isEnded = ended === undefined ? faker.random.arrayElement([true, false]) : ended;
  const statefulProps = {
    ...(isEnded
      ? {
        status: 'ENDED',
      }
      : {
        status: 'ONGOING',
        endedAt: null,
      }),
  };
  return Object.assign({}, defaultProps, statefulProps, props);
};

export default async (props = {}, options = {}, num = 1) => {
  if (num === 1) return models.entry.create(data(props, options));
  const filled = Array.from({ length: num }, () => data(props, options));
  return models.entry.bulkCreate(filled);
};
