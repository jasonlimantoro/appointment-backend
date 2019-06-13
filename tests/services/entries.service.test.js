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
    expect(res.length).toEqual(3);
    expect(res).toMatchSnapshot();
  });
});
