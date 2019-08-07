import { truncateDb, closeDb } from './utils';

beforeEach(async () => {
  await truncateDb();
});

afterAll(async () => {
  await closeDb();
});
