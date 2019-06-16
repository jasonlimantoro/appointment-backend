import { NotImplementedError, InvalidArgumentError } from '../libs/errors';

export default class BaseService {
  static throwNotImplementedError = message => {
    throw new NotImplementedError(message);
  };

  static throwInvalidArgumentsError = message => {
    throw new InvalidArgumentError(message);
  };

  list = async () => {
    this.constructor.throwNotImplementedError();
  };

  get = async () => {
    this.constructor.throwNotImplementedError();
  };

  create = async () => {
    this.constructor.throwNotImplementedError();
  };
}
