import faker from 'faker';

import models from '../../database/models';
import guestFactory from './guest';
import sessionFactory from './session';

const data = async (props = {}, options = {}) => {
  const defaultProps = {
    id: faker.random.uuid(),
    see: faker.name.findName(),
    status: faker.random.arrayElement(['ONGOING', 'ENDED']),
    guestId: !props.guestId
      ? (await guestFactory()).getDataValue('NIK')
      : faker.finance.account(16),
    sessionId: !props.sessionId
      ? (await sessionFactory()).getDataValue('id')
      : faker.random.uuid(),
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
  const filled = await Promise.all(
    Array.from({ length: num }, () => data(props, options)),
  );
  const res = await models.entry.bulkCreate(filled);
  if (num === 1) return res[0];
  return res;
};
