import { PhotoService } from '../../services';
import mockEntries from '../../fixtures/entries';

const service = new PhotoService();
describe('Photo service', () => {
  it('create: should work', async () => {
    const attributes = {
      key: 'xyz',
      entryId: mockEntries[0].id,
    };
    const res = await service.create(attributes);
    expect(res).toEqual({
      ...attributes,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});
