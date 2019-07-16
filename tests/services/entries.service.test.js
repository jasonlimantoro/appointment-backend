/* eslint-disable import/named */
import _ from 'lodash';
import uuid from 'uuid';
import { InvalidArgumentError } from '../../libs/errors';
import { EntryService } from '../../services';
import mockEntries from '../../fixtures/entries';
import mockGuests from '../../fixtures/guests';
import ModelService, {
  mockList,
  mockGet,
  mockPut,
  mockUpdate,
  mockWhere,
} from '../../services/model.service';
import * as datetimeUtils from '../../libs/datetime';

jest.mock('../../services/model.service');

let spiedHumanFormat;
let spiedUuid;
let service;

beforeEach(() => {
  spiedHumanFormat = jest
    .spyOn(datetimeUtils, 'humanFormat')
    .mockReturnValue('some-date');
  spiedUuid = jest.spyOn(uuid, 'v1').mockReturnValue('some-id');
  service = new EntryService();
});

afterEach(() => {
  ModelService.mockClear();
  mockList.mockClear();
  mockGet.mockClear();
  mockPut.mockClear();
  mockWhere.mockClear();
  mockUpdate.mockClear();
});

describe('Entry Service', () => {
  it('list: should work', async () => {
    mockList.mockResolvedValue(_.take(mockEntries, 3));
    const res = await service.list();
    expect(mockList).toBeCalled();
    expect(res).toEqual(_.take(mockEntries, 3));
  });

  it('get: should work', async () => {
    mockGet.mockResolvedValue(mockEntries[0]);
    const res = await service.get(mockEntries[0].id);
    expect(res).toEqual(mockEntries[0]);
    expect(mockGet).toBeCalledWith({ key: { id: mockEntries[0].id } });
  });

  it('create: should work', async () => {
    const attributes = {
      see: 'xyz',
      guestId: mockGuests[0].NIK,
      userId: 'some-user-id',
    };
    mockPut.mockResolvedValue({
      ...attributes,
      id: 'some-id',
      createdAt: 'some-date',
    });
    const res = await service.create(attributes);
    expect(res).toEqual({
      ...attributes,
      id: 'some-id',
      createdAt: 'some-date',
    });
    expect(mockPut).toBeCalledWith({
      Item: {
        id: 'some-id',
        status: 'ONGOING',
        see: attributes.see,
        guestId: attributes.guestId,
        createdAt: 'some-date',
        userId: 'some-user-id',
      },
    });
    expect(spiedUuid).toBeCalled();
  });

  it('create: should synchronously throw error if guestId is not present', async () => {
    await expect(service.create({ see: 'foobar' })).rejects.toThrow(
      InvalidArgumentError,
    );
  });

  it('end: should add the endedAt field', async () => {
    mockUpdate.mockResolvedValue(mockEntries[3]);
    const res = await service.end(mockEntries[3].id);
    expect(res).toEqual(mockEntries[3]);
    expect(mockUpdate.mock.calls[0][0]).toMatchObject({
      Key: { id: mockEntries[3].id },
      UpdateExpression: 'set endedAt = :now, #stats = :finished',
      ExpressionAttributeNames: {
        '#stats': 'status',
      },
      ExpressionAttributeValues: {
        ':now': 'some-date',
        ':finished': 'FINISHED',
      },
      ConditionExpression: 'attribute_not_exists(endedAt)',
      ReturnValues: 'ALL_NEW',
    });
    expect(spiedHumanFormat).toBeCalled();
  });

  it('end: should not perform the update for already ended entry', async () => {
    mockUpdate.mockRejectedValue(new Error('error'));
    const mock = mockEntries[0];
    await expect(service.end(mock.id)).rejects.toThrow();
    expect(mockUpdate).toBeCalledTimes(1);
  });

  it('byGuestId: should work', async () => {
    mockWhere.mockResolvedValue(_.take(mockEntries, 4));
    const res = await service.byGuestId(mockGuests[1].NIK);

    expect(res).toEqual(_.take(mockEntries, 4));
    expect(mockWhere.mock.calls[0][0]).toMatchObject({
      IndexName: 'guestId-index',
      KeyConditionExpression: 'guestId = :guestId',
      ExpressionAttributeValues: {
        ':guestId': mockGuests[1].NIK,
      },
    });
  });
});
