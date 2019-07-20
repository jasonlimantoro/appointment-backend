import faker from 'faker';
import path from 'path';
import { humanFormat } from './datetime';

faker.seed(123);

/**
 * Temporary fix because it is not yet implemented
 */
faker.system.directoryPath = () => path.format({
  base: faker
    .fake('{{random.words}}')
    .replace(/ /g, path.sep)
    .toLowerCase(),
});

/**
 * Temporary fix becuase it is not yet implemented
 */
faker.system.filePath = () => faker.system.directoryPath() + path.sep + faker.system.fileName();

export default class Seeder {
  static seedNumber = {
    guests: 10,
    entries: 15,
    photos: 20,
  };

  static guest = () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    NIK: faker.finance.account(16),
    company: faker.company.companyName(),
    email: faker.internet.email(),
  });

  static entry = (guestId, userId, ended = false) => {
    const isEnded = ended || faker.random.arrayElement([false, true]);
    return {
      id: faker.random.uuid(),
      see: faker.name.findName(),
      createdAt: humanFormat(faker.date.recent(0.1)),
      status: isEnded ? 'FINISHED' : 'ONGOING',
      guestId: guestId || faker.finance.account(16),
      userId: userId || faker.random.uuid(),
      endedAt: isEnded ? humanFormat(faker.date.future(0.1)) : null,
    };
  };

  static photo = (entryId, createdAt) => ({
    id: faker.random.uuid(),
    key: faker.system.filePath(),
    entryId: entryId || faker.random.uuid(),
    createdAt: createdAt || humanFormat(faker.date.past()),
  });
}
export const arrayOf = (times, generator, argsProducer = () => []) => {
  const result = [];
  for (let i = 0; i < times; ++i) {
    result.push(generator(...argsProducer()));
  }

  return result;
};
