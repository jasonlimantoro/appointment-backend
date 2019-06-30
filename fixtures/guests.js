const casual = require('casual');
const seeder = require('../libs/seeder');

const guests = seeder.arrayOf(seeder.seederNum.guests, casual._guest);

module.exports = guests;
