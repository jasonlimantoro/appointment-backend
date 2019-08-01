import faker from 'faker';

import models from '../../database/models';

const data = (props = {}) => {
  const defaultProps = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    NIK: faker.finance.account(16),
    company: faker.company.companyName(),
    email: faker.internet.email(),
  };
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}) => models.guest.create(data(props));
