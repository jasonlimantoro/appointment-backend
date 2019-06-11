import GuestService from '../../services/guest';

describe('Guest service', () => {
  const mockedData = [
    { id: '123', firstName: 'asdf', lastName: 'ghjkl' },
    { id: '234', firstName: 'qwert', lastName: 'tyuio' },
  ];
  const service = new GuestService({ mockedData });
  it('list: should return the passed mockedData', () => {
    const res = service.list();
    expect(res).toEqual(mockedData);
  });
  it('get: should return the correct object', () => {
    const res = service.get('234');
    expect(res).toEqual(mockedData[1]);
  });
});
