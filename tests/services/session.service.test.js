import uuid from 'uuid';
import { SessionService } from '../../services';
import { sessionFactory } from '../factories';
import '../dbHooks';

const service = new SessionService();
const mockUserId = 'uuid-user';
const mockSessionId = 'uuid-session';

beforeEach(async () => {
  jest.spyOn(uuid, 'v4').mockReturnValue(mockSessionId);
});

describe('Session Service', () => {
  it('create: should work', async () => {
    const res = await service.create({ userId: mockUserId });
    expect(res.id).toEqual(mockSessionId);
  });

  it('end: should add a non-existent endedAt attribute', async () => {
    const newSession = await sessionFactory({}, { ended: false });
    expect(newSession.getDataValue('endedAt')).toBeNull();
    const ended = await service.end({ id: newSession.getDataValue('id') });
    expect(ended.getDataValue('endedAt')).not.toBeNull();
  });
});
