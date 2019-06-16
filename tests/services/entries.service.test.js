import AWS from 'aws-sdk';
import EntryService from '../../services/entry.service';
import mockEntries from '../../fixtures/entries';
import mockGuests from '../../fixtures/guests';

const localDynamo = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: process.env.dynamoDBEndPoint,
});
const service = new EntryService({ dataSource: localDynamo });

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
    await expect(service.create({ see: 'foobar' })).rejects.toThrow();
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
});
