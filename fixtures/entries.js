const _ = require('lodash');
const guests = require('./guests');
const seeder = require('../libs/seeder');

const entries = seeder.arrayOf(
  seeder.seederNum.entries,
  seeder.Seeder.entry,
  () => [_.sample(guests).NIK],
);

module.exports = entries;
