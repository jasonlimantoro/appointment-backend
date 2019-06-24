import moment from 'moment';
import { filterToday, checkAuthentication } from '../../libs/resolverUtils';
import Auth from '../../libs/auth';
import { AuthenticationError } from '../../libs/errors';

jest.mock('jsonwebtoken');

describe('resolverUtils', () => {
  describe('filterToday', () => {
    it('should work', () => {
      const given = [
        {
          createdAt: moment().hours(12),
        },
        {
          createdAt: moment().hours(15),
          endedAt: moment().hours(16),
        },
        {
          createdAt: moment().hours(-1),
        },
      ];
      const actual = filterToday(given);
      expect(actual).toEqual([given[0]]);
    });
  });

  describe('checkAuthentication', () => {
    it('should throw error when header is invalid', async () => {
      const controller = jest.fn();
      const context = {};
      await expect(checkAuthentication(context, controller)).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should throw error when jwt verification fails', async () => {
      const controller = jest.fn();
      Auth.verifyJwt = jest.fn().mockResolvedValue(false);

      const context = {
        headers: {
          authorization: 'Bearer some-token',
        },
      };
      await expect(checkAuthentication(context, controller)).rejects.toThrow(
        AuthenticationError,
      );
      expect(Auth.verifyJwt).toBeCalledWith('some-token');
    });

    it('should work', async () => {
      const controller = jest.fn().mockResolvedValue({ message: 'some-value' });
      Auth.verifyJwt = jest.fn().mockResolvedValue(true);
      const context = {
        headers: {
          authorization: 'Bearer some-token',
        },
      };
      const res = await checkAuthentication(context, controller);
      expect(controller).toBeCalled();
      expect(Auth.verifyJwt).toBeCalledWith('some-token');
      expect(res).toEqual({ message: 'some-value' });
    });
  });
});
