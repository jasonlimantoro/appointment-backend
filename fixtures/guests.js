import Seeder, { arrayOf } from '../libs/seeder';

const guests = arrayOf(Seeder.seedNumber.guests, Seeder.guest);

export default guests;
