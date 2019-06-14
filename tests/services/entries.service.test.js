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
    expect(res).toContainEqual(mockEntries[0]);
  });

  it('get: should work', async () => {
    const res = await service.get(mockEntries[0].id);
    expect(res).toEqual(mockEntries[0]);
  });

  it('create: should work', async () => {
    const attributes = {
      id: 'asdf',
      see: 'xyz',
      guestId: mockGuests[0],
    };
    const res = await service.create(attributes);
    expect(res).toEqual({ ...attributes, createdAt: expect.any(String) });
  });
});
