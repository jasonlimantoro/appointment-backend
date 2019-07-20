import { PhotoService } from '../../services';
import Seeder from '../../libs/seeder';
import * as datetimeUtils from '../../libs/datetime';
import ModelService, * as mocked from '../../services/model.service';

jest.mock('../../services/model.service');

afterEach(() => {
  ModelService.mockClear();
  mocked.mockList.mockClear();
  mocked.mockGet.mockClear();
  mocked.mockPut.mockClear();
  mocked.mockUpdate.mockClear();
});
const service = new PhotoService();
describe('Photo service', () => {
  it('create: should work', async () => {
    const photo = Seeder.photo();
    mocked.mockPut.mockResolvedValue(photo);
    const spiedHumanFormat = jest
      .spyOn(datetimeUtils, 'humanFormat')
      .mockReturnValue('some-date');

    const res = await service.create(photo);
    expect(mocked.mockPut).toBeCalledWith({
      Item: {
        ...photo,
        createdAt: 'some-date',
      },
    });
    expect(spiedHumanFormat).toBeCalled();
    expect(res).toEqual(res);
  });

  it('byEntry: should work', async () => {
    const NIKPhoto = Seeder.photo('some-id');
    const PersonPhoto = Seeder.photo('some-id');
    mocked.mockWhere.mockResolvedValue({ Items: [NIKPhoto, PersonPhoto] });
    const res = await service.byEntry('some-id');
    expect(mocked.mockWhere).toBeCalledWith({
      IndexName: 'entryId-index',
      KeyConditionExpression: 'entryId = :entryId',
      ExpressionAttributeValues: {
        ':entryId': 'some-id',
      },
    });
    expect(res).toEqual([NIKPhoto, PersonPhoto]);
  });
});
