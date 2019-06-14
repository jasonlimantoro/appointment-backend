import AWS from 'aws-sdk';
import EntryService from '../../services/entry.service';
import mockedData from '../../fixtures/entries';

const localDynamo = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: process.env.dynamoDBEndPoint,
});
const service = new EntryService({ dataSource: localDynamo });

describe('Entry Service', () => {
  it('list: should work', async () => {
    const res = await service.list();
    expect(res).toContainEqual(mockedData[0]);
  });

  it('get: should work', async () => {
    const res = await service.get(mockedData[0].id);
    expect(res).toEqual(mockedData[0]);
  });

  it('create: should work', async () => {
    const attributes = {
      id: 'asdf',
      see: 'xyz',
      Guest: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        company: 'Amazon',
        NIK: 'abcdefghijklmnop',
      },
    };
    const res = await service.create(attributes);
    expect(res).toEqual(attributes);
  });
});
