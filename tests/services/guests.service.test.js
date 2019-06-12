import GuestService from '../../services/guest.service';
import { mockedGuests as mockedData } from '../../fixtures/guests';

describe('Guest service', () => {
  const service = new GuestService({ mockedData, mocked: true });
  it('list: should return the passed mockedData', () => {
    const res = service.list();
    expect(res).toEqual(mockedData);
  });
  it('get: should return the correct object', () => {
    const { id } = mockedData[1];
    const res = service.get(id);
    expect(res).toEqual(mockedData[1]);
  });
});
