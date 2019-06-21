import { InvalidArgumentError } from '../../libs/errors';
import { EntryService } from '../../services';
import mockEntries from '../../fixtures/entries';
import mockGuests from '../../fixtures/guests';

const service = new EntryService();

describe('Entry Service', () => {
  it('list: should work', async () => {
    const res = await service.list();
    expect(res).toContainEqual({
      ...mockEntries[0],
      endedAt: expect.any(String),
    });
  });

  it('get: should work', async () => {
    const res = await service.get(mockEntries[0].id);
    expect(res).toEqual({ ...mockEntries[0], endedAt: expect.any(String) });
  });

  it('create: should work', async () => {
    const attributes = {
      see: 'xyz',
      guestId: mockGuests[0].id,
    };
    const res = await service.create(attributes);
    expect(res).toEqual({
      ...attributes,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it('create: should synchronously throw error if guestId is not present', async () => {
    await expect(service.create({ see: 'foobar' })).rejects.toThrow(
      InvalidArgumentError,
    );
  });

  it('end: should add the endedAt field', async () => {
    const entry = await service.create({
      see: 'foo',
      guestId: mockGuests[0].id,
    });
    const res = await service.end(entry.id);
    expect(res).toEqual({ ...entry, endedAt: expect.any(String) });
  });

  it('end: should not perform the update for already ended entry', async () => {
    const mock = mockEntries[0];
    await expect(service.end(mock.id)).rejects.toThrow();
  });

  it('byGuestId: should work', async () => {
    const attributes = {
      see: 'foobar',
      guestId: mockGuests[1].id,
    };
    await service.create(attributes);
    const res = await service.byGuestId(mockGuests[1].id);
    res.forEach(({ guestId }) => expect(guestId).toEqual(attributes.guestId));
  });
});
