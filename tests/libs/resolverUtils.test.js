import moment from 'moment';
import mime from 'mime-types';
import {
  filterToday,
  checkAuthentication,
  checkAuthGroup,
  constructFileName,
} from '../../libs/resolverUtils';
import * as datetimeUtils from '../../libs/datetime';
import Auth from '../../libs/auth';
import { AuthenticationError, AuthorizationError } from '../../libs/errors';

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
  describe('checkGroupAuth', () => {
    it('should work', async () => {
      const controller = jest.fn().mockResolvedValue({ message: 'success' });
      const mockUser = {
        'cognito:groups': ['admin'],
      };
      const spiedJwtVerification = jest
        .spyOn(Auth, 'verifyJwt')
        .mockResolvedValue(mockUser);
      const context = {
        headers: {
          authorization: 'Bearer some-token',
        },
      };
      const res = await checkAuthGroup(
        context,
        ['admin'],
        controller,
        'other',
        'params',
      );
      expect(controller).toBeCalledWith('other', 'params', mockUser, context);
      expect(spiedJwtVerification).toBeCalledWith('some-token');
      expect(res).toEqual({ message: 'success' });
    });
    it('should throw error when expected group is invalid', async () => {
      const controller = jest.fn().mockResolvedValue({ message: 'success' });
      const mockUser = {
        'cognito:groups': ['admin'],
      };
      const spiedJwtVerification = jest
        .spyOn(Auth, 'verifyJwt')
        .mockResolvedValue(mockUser);
      const context = {
        headers: {
          authorization: 'Bearer some-token',
        },
      };
      await expect(
        checkAuthGroup(context, ['staff'], controller, 'other', 'params'),
      ).rejects.toThrow(
        new AuthorizationError(
          'You are not authorized. Expected scopes: staff',
        ),
      );
      expect(spiedJwtVerification).toBeCalledWith('some-token');
      expect(controller).not.toBeCalled();
    });
  });
  describe('constructFileName', () => {
    it('should work', () => {
      const spiedHumanFormat = jest
        .spyOn(datetimeUtils, 'humanFormat')
        .mockReturnValue(new Date(2012, 2, 10).toLocaleTimeString());

      const spiedMime = jest.spyOn(mime, 'extension').mockReturnValue('png');
      expect(
        constructFileName({
          prefix: 'some-file-dir',
          fileName: 'jason-gunawan',
          fileType: 'image/png',
        }),
      ).toMatchSnapshot();
      expect(spiedHumanFormat).toBeCalled();
      expect(spiedMime).toBeCalledWith('image/png');
    });
  });
});
