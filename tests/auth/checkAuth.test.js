import Auth from '../../auth';
import { checkAuthentication } from '../../schema/entry/resolvers';
import { AuthenticationError } from '../../libs/errors';

jest.mock('jsonwebtoken');

describe('Authentication middleware', () => {
  it('checkAuthentication: should throw error when header is invalid', async () => {
    const controller = jest.fn();
    const context = {};
    await expect(checkAuthentication(context, controller)).rejects.toThrow(
      AuthenticationError,
    );
  });

  it('checkAuthentication: should throw error when jwt verification fails', async () => {
    const controller = jest.fn();
    Auth.verifyJwt = jest.fn().mockResolvedValue(false);

    const context = {
      headers: {
        Authorization: 'Bearer some-token',
      },
    };
    await expect(checkAuthentication(context, controller)).rejects.toThrow(
      AuthenticationError,
    );
    expect(Auth.verifyJwt).toBeCalledWith('some-token');
  });

  it('checkAuthentication: should work', async () => {
    const controller = jest.fn().mockResolvedValue({ message: 'some-value' });
    Auth.verifyJwt = jest.fn().mockResolvedValue(true);
    const context = {
      headers: {
        Authorization: 'Bearer some-token',
      },
    };
    const res = await checkAuthentication(context, controller);
    expect(controller).toBeCalled();
    expect(Auth.verifyJwt).toBeCalledWith('some-token');
    expect(res).toEqual({ message: 'some-value' });
  });
});
