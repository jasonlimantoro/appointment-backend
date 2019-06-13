import AWS from 'aws-sdk';
import GuestService from '../../services/guest.service';
import mockedData from '../../fixtures/guests';

const localDynamo = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: process.env.dynamoDBEndPoint,
});
const service = new GuestService({ dataSource: localDynamo });

describe('Guest service', () => {
  it('list: should return the passed mockedData', async () => {
    const res = await service.list();
    expect(res).toContainEqual(mockedData[0]);
    expect(res).toContainEqual(mockedData[1]);
    expect(res).toContainEqual(mockedData[2]);
  });
  it('get: should return the correct object', async () => {
    const { id } = mockedData[1];
    const res = await service.get({ id });
    expect(res).toEqual(mockedData[1]);
  });
  it('create: should save an item', async () => {
    const res = await service.create(mockedData[0]);
    expect(res).toEqual(mockedData[0]);
  });

  it('byName: should return the correct object', async () => {
    const { firstName, lastName } = mockedData[2];
    const res = await service.byName({ firstName, lastName });
    expect(res).toEqual(mockedData[2]);
  });
});