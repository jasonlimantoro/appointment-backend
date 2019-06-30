import _ from 'lodash';
import { GuestService } from '../../services';
import mockedData from '../../fixtures/guests';
import ModelService, * as mocked from '../../services/model.service';

jest.mock('../../services/model.service');
const service = new GuestService();

afterEach(() => {
  ModelService.mockClear();
  mocked.mockList.mockClear();
  mocked.mockGet.mockClear();
  mocked.mockUpdate.mockClear();
  mocked.mockWhere.mockClear();
  mocked.mockPut.mockClear();
});
describe('Guest service', () => {
  it('list: should return the passed mockedData', async () => {
    mocked.mockList.mockResolvedValue(_.take(mockedData, 3));
    const res = await service.list();
    expect(res).toEqual(_.take(mockedData, 3));
    expect(mocked.mockList).toBeCalled();
  });
  it('get: should return the correct object', async () => {
    const { NIK } = mockedData[1];
    mocked.mockGet.mockResolvedValue(mockedData[1]);
    const res = await service.get(NIK);
    expect(res).toEqual(mockedData[1]);
    expect(mocked.mockGet).toBeCalledWith({ Key: { NIK } });
  });

  it('getByIds: should work', async () => {
    const ids = _.map(_.take(mockedData, 3), 'NIK');
    mocked.mockGet.mockResolvedValueOnce(mockedData[1]);
    mocked.mockGet.mockResolvedValueOnce(mockedData[2]);
    mocked.mockGet.mockResolvedValueOnce(mockedData[3]);
    const res = await service.getByIds(ids);
    expect(res).toEqual([mockedData[1], mockedData[2], mockedData[3]]);
    expect(mocked.mockGet).toBeCalledTimes(3);
    expect(mocked.mockGet.mock.calls[0][0]).toEqual({
      Key: { NIK: mockedData[0].NIK },
    });
  });
  it('create: should save an item', async () => {
    mocked.mockPut.mockResolvedValue(mockedData[0]);
    const res = await service.create(mockedData[0]);
    expect(res).toEqual(mockedData[0]);
    expect(mocked.mockPut).toBeCalledWith({
      Item: mockedData[0],
    });
  });

  it('byName: should return the correct object', async () => {
    mocked.mockWhere.mockResolvedValue([mockedData[2]]);
    const { firstName, lastName } = mockedData[2];
    const res = await service.byName({ firstName, lastName });
    expect(res).toEqual(mockedData[2]);
    expect(mocked.mockWhere).toBeCalledWith({
      IndexName: 'firstName-index',
      KeyConditionExpression: 'firstName = :firstName AND lastName = :lastName',
      ExpressionAttributeValues: {
        ':firstName': firstName,
        ':lastName': lastName,
      },
    });
  });

  it('findOrCreate: should return the existing data', async () => {
    mocked.mockWhere.mockResolvedValue([mockedData[1]]);
    const { firstName, lastName } = mockedData[1];
    const res = await service.findOrCreate({ firstName, lastName });
    expect(res).toEqual(mockedData[1]);
    expect(mocked.mockWhere).toBeCalledWith({
      IndexName: 'firstName-index',
      KeyConditionExpression: 'firstName = :firstName AND lastName = :lastName',
      ExpressionAttributeValues: {
        ':firstName': firstName,
        ':lastName': lastName,
      },
    });
    expect(mocked.mockPut).not.toBeCalled();
  });
  it('findOrCreate: should create when data does not exist', async () => {
    const newData = {
      firstName: 'some-name',
      lastName: 'some-family-name',
      email: 'someone@example.com',
      NIK: '123123',
      company: 'abc',
    };
    mocked.mockPut.mockResolvedValue(newData);
    mocked.mockWhere.mockResolvedValue([]);
    const res = await service.findOrCreate(newData);
    expect(mocked.mockPut).toBeCalledWith({ Item: newData });
    expect(res).toEqual({ ...newData, justCreated: true });
  });
});
