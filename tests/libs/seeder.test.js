import casual from 'casual';
import * as seederUtil from '../../libs/seeder';

const spiedRNG = jest.spyOn(casual, '_random').mockReturnValue(1);

beforeEach(() => {
  spiedRNG.mockClear();
});
describe('seederUtil', () => {
  it('arrayOf: should work', () => {
    const actual = seederUtil.arrayOf(3, casual._random);
    expect(actual).toEqual([1, 1, 1]);
    expect(spiedRNG).toBeCalledTimes(3);
  });

  it('arrayOf: should work when argsProducer argument is provided', () => {
    const argsProducer = jest.fn().mockReturnValue([2, 3, 4]);
    const actual = seederUtil.arrayOf(3, casual._random, argsProducer);
    expect(actual).toEqual([1, 1, 1]);
    expect(argsProducer).toBeCalledTimes(3);
    expect(spiedRNG)
      .toBeCalledTimes(3)
      .toBeCalledWith(2, 3, 4);
  });
});
