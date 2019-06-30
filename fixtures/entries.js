import sample from 'lodash/sample';
import guests from './guests';
import Seeder, { arrayOf } from '../libs/seeder';

const entries = arrayOf(Seeder.seedNumber.entries, Seeder.entry, () => [
  sample(guests).NIK,
]);

export default entries;
