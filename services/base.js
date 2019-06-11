/* eslint-disable class-methods-use-this */

export default class BaseService {
  constructor({ mockedData = [] } = {}) {
    this.mockedData = mockedData;
  }

  static throwImplementationError = () => {
    throw new Error('Must implement this method');
  };

  list() {
    BaseService.throwImplementationError();
  }

  // eslint-disable-next-line no-unused-vars
  get(id) {
    BaseService.throwImplementationError();
  }
}
