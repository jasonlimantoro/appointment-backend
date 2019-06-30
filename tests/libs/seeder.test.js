import faker from 'faker';
import Seeder, { arrayOf } from '../../libs/seeder';

const spiedRNG = jest.spyOn(faker.random, 'number').mockReturnValue(1);

beforeEach(() => {
  spiedRNG.mockClear();
});
describe('seederUtil', () => {
  it('arrayOf: should work', () => {
    const actual = arrayOf(3, faker.random.number);
    expect(actual).toEqual([1, 1, 1]);
    expect(spiedRNG).toBeCalledTimes(3);
  });

  it('arrayOf: should work when argsProducer argument is provided', () => {
    const argsProducer = jest.fn().mockReturnValue([2, 3, 4]);
    const actual = arrayOf(3, faker.random.number, argsProducer);
    expect(actual).toEqual([1, 1, 1]);
    expect(argsProducer).toBeCalledTimes(3);
    expect(spiedRNG)
      .toBeCalledTimes(3)
      .toBeCalledWith(2, 3, 4);
  });

  it('seeder: should have guest generator', () => {
    const actual = Seeder.guest();
    expect(Object.keys(actual)).toEqual(
      expect.arrayContaining([
        'firstName',
        'lastName',
        'email',
        'NIK',
        'company',
      ]),
    );
  });
  it('seeder: should have an entry generator', () => {
    const actual = Seeder.entry();
    expect(Object.keys(actual)).toEqual(
      expect.arrayContaining(['id', 'see', 'createdAt', 'endedAt']),
    );
  });
});
