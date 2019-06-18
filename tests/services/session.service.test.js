import { SessionService } from '../../services';
import { InvalidArgumentError } from '../../libs/errors';

const service = new SessionService();
const mockUserId = 'uuid-user';

describe('Session Service', () => {
  it('create: should work', async () => {
    const res = await service.create({ userId: mockUserId });
    expect(res).toEqual({
      userId: mockUserId,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });
  it('create: should throw if no userId is passed', async () => {
    await expect(service.create()).rejects.toThrow(InvalidArgumentError);
  });

  it('end: should add a non-existent endedAt attribute', async () => {
    const newSession = await service.create({ userId: mockUserId });
    expect(newSession.endedAt).not.toBeDefined();
    const ended = await service.end({ id: newSession.id });
    expect(ended.endedAt).toEqual(expect.any(String));
  });
});
