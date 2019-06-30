const faker = require('faker');
const moment = require('moment');

faker.seed(123);
module.exports.Seeder = {
  guest: () => ({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    NIK: faker.finance.account(16),
    company: faker.company.companyName(),
    email: faker.internet.email(),
  }),
  entry: (guestId, ended = true) => ({
    id: faker.random.uuid(),
    see: faker.name.findName(),
    createdAt: moment(faker.date.past(1, '2019-08-01')).format(
      'YYYY-MM-DDTHH:mm:ss',
    ),
    guestId,
    endedAt: ended
      ? moment(faker.date.future(1, '2019-08-01')).format('YYYY-MM-DDTHH:mm:ss')
      : null,
  }),
};

module.exports.arrayOf = function arrayOf(
  times,
  generator,
  argsProducer = () => [],
) {
  const result = [];
  for (let i = 0; i < times; ++i) {
    result.push(generator(...argsProducer()));
  }

  return result;
};

module.exports.seederNum = {
  guests: 10,
  entries: 15,
};
