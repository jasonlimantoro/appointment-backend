import ModelService from './model.service';
import dynamoClient from '../config/dynamodb';
import { NotImplementedError, InvalidArgumentError } from '../libs/errors';

export default class BaseService {
  constructor({ tableName, dataSource = dynamoClient } = {}) {
    this._util = new ModelService({ tableName, dataSource });
    this.dataSource = dataSource;
    this.tableName = tableName;
  }

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
