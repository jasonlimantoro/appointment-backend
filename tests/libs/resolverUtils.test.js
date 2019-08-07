import mime from 'mime-types';
import Auth from '@aws-amplify/auth';
import {
  checkAuthentication,
  checkAuthGroup,
  constructFileName,
  checkNotAuthenticated,
} from '../../libs/resolverUtils';
import * as datetimeUtils from '../../libs/datetime';
import CustomAuth from '../../libs/auth';
import { AuthenticationError, AuthorizationError } from '../../libs/errors';

jest.mock('jsonwebtoken');

describe('resolverUtils', () => {
  describe('checkAuthentication', () => {
    it('should throw error when header is invalid', async () => {
      const controller = jest.fn();
      const context = {
        headers: {
          authorization: 'Bearer lallla',
        },
      };
      await expect(checkAuthentication(context, controller)).rejects.toThrow(
        AuthenticationError,
      );
    });

    it('should throw error when jwt verification fails', async () => {
      const controller = jest.fn();
      CustomAuth.verifyJwt = jest.fn().mockResolvedValue(false);

      const context = {
        headers: {
          authorization: 'Bearer some-token',
        },
      };
      await expect(checkAuthentication(context, controller)).rejects.toThrow(
        AuthenticationError,
      );
      expect(CustomAuth.verifyJwt).toBeCalledWith('some-token');
    });

    it('should work', async () => {
      const controller = jest.fn().mockResolvedValue({ message: 'some-value' });
      CustomAuth.verifyJwt = jest.fn().mockResolvedValue(true);
      const context = {
        headers: {
          authorization: 'Bearer some-token',
        },
      };
      const res = await checkAuthentication(context, controller);
      expect(controller).toBeCalled();
      expect(CustomAuth.verifyJwt).toBeCalledWith('some-token');
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
        .spyOn(CustomAuth, 'verifyJwt')
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
        .spyOn(CustomAuth, 'verifyJwt')
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
  describe('checkNotAuth', () => {
    it('should throw error if there is an authenticated user', async () => {
      const spiedUserInfo = jest
        .spyOn(Auth, 'currentUserInfo')
        .mockResolvedValue(true);
      const controller = jest.fn().mockResolvedValue({ message: 'success' });
      await expect(checkNotAuthenticated({}, controller)).rejects.toThrow(
        AuthenticationError,
      );
      expect(spiedUserInfo).toBeCalled();
    });
    it('should pass if no authenticated user', async () => {
      const spiedUserInfo = jest
        .spyOn(Auth, 'currentUserInfo')
        .mockResolvedValue(false);
      const controller = jest.fn().mockResolvedValue({ message: 'success' });
      expect(await checkNotAuthenticated({}, controller)).toEqual({
        message: 'success',
      });
      expect(spiedUserInfo).toBeCalled();
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
