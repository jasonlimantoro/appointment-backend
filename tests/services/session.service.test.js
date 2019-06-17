import AWS from 'aws-sdk';
import uuid from 'uuid';
import SessionService from '../../services/session.service';
import { InvalidArgumentError } from '../../libs/errors';

jest.mock('uuid');

const localDynamo = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: process.env.dynamoDBEndPoint,
});
const service = new SessionService({ dataSource: localDynamo });

describe('Session Service', () => {
  it('create: should work', async () => {
    const mockUserId = 'uuid-user';
    const sessionId = 'sessionId';
    uuid.v1 = jest.fn().mockReturnValue(sessionId);
    const res = await service.create({ userId: mockUserId });
    expect(uuid.v1).toBeCalled();
    expect(res).toEqual({
      userId: mockUserId,
      id: sessionId,
      createdAt: expect.any(String),
    });
  });
  it('create: should throw if no userId is passed', async () => {
    await expect(service.create()).rejects.toThrow(InvalidArgumentError);
  });
});
