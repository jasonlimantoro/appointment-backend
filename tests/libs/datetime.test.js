import { humanFormat } from '../../libs/datetime';

describe('Datetime', () => {
  it('should properly format', () => {
    const date = new Date(2012, 7, 12, 17, 9, 10);
    const actual = humanFormat(date);
    expect(actual).toEqual('2012-07-12 17:09:10');
  });
});
