import faker from 'faker';

import models from '../../database/models';

const data = (props = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    see: faker.name.findName(),
    status: faker.random.arrayElement(['ONGOING', 'ENDED']),
    guestId: faker.finance.account(16),
  };
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}) => models.entry.create(data(props));
