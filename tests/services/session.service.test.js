import uuid from 'uuid';
import { SessionService } from '../../services';
import { truncateDb } from '../utils';
import { sessionFactory } from '../factories';

const service = new SessionService();
const mockUserId = 'uuid-user';
const mockSessionId = 'uuid-session';

beforeEach(async () => {
  await truncateDb();
  jest.spyOn(uuid, 'v4').mockReturnValue(mockSessionId);
});

describe('Session Service', () => {
  it('create: should work', async () => {
    const res = await service.create({ userId: mockUserId });
    expect(res.id).toEqual(mockSessionId);
  });

  it('end: should add a non-existent endedAt attribute', async () => {
    const newSession = await sessionFactory();
    expect(newSession.getDataValue('endedAt')).not.toBeDefined();
    const ended = await service.end({ id: newSession.getDataValue('id') });
    expect(ended.getDataValue('endedAt')).toBeDefined();
  });
});
