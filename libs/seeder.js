const casual = require('casual');

casual.seed(123);
casual.define('datetime', () => `${casual.date()}T${casual.time()}`);
casual.define('guest', () => ({
  firstName: casual.first_name,
  lastName: casual.last_name,
  NIK: casual.card_data.number,
  company: casual.company_name,
  email: casual.email,
}));

casual.define('entry', (guestId, ended = true) => ({
  id: casual.uuid,
  see: casual.full_name,
  guestId,
  createdAt: casual.datetime,
  endedAt: ended ? casual.datetime : null,
}));

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
