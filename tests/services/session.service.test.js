import uuid from 'uuid';
import { SessionService } from '../../services';
import { InvalidArgumentError } from '../../libs/errors';

jest.mock('uuid');

const service = new SessionService();

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
