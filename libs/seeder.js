import faker from 'faker';
import { humanFormat } from './datetime';

faker.seed(123);

export default class Seeder {
  static seedNumber = {
    guests: 10,
    entries: 15,
  };

  static guest = () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    NIK: faker.finance.account(16),
    company: faker.company.companyName(),
    email: faker.internet.email(),
  });

  static entry = (guestId, ended = true) => ({
    id: faker.random.uuid(),
    see: faker.name.findName(),
    createdAt: humanFormat(faker.date.past(1, '2019-08-01')),
    guestId,
    endedAt: ended ? humanFormat(faker.date.future(1, '2019-08-01')) : null,
  });
}
export const arrayOf = (times, generator, argsProducer = () => []) => {
  const result = [];
  for (let i = 0; i < times; ++i) {
    result.push(generator(...argsProducer()));
  }

  return result;
};
