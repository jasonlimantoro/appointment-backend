const _ = require('lodash');
const casual = require('casual');
const guests = require('./guests');
const seeder = require('../libs/seeder');

const entries = seeder.arrayOf(seeder.seederNum.entries, casual._entry, () => [
  _.sample(guests).NIK,
]);

module.exports = entries;
