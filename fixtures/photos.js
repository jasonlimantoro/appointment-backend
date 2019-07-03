import sample from 'lodash/sample';
import entries from './entries';
import Seeder, { arrayOf } from '../libs/seeder';

const photos = arrayOf(Seeder.seedNumber.photos, Seeder.photo, () => [
  sample(entries).id,
]);

export default photos;
