const seeder = require('../libs/seeder');

const guests = seeder.arrayOf(seeder.seederNum.guests, seeder.Seeder.guest);

module.exports = guests;
