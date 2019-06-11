/* eslint-disable class-methods-use-this */

export default class BaseService {
  static invalidArgumentsError = new Error('Invalid combination of mocked and mockedData');

  static notImplementedError = new Error('Must implement this method!');

  constructor({ mockedData = [], mocked = false } = {}) {
    this.mocked = mocked;
    this.data = mockedData;
  }

  set data(data) {
    if (!this.mocked && data.length > 0) {
      throw BaseService.invalidArgumentsError;
    }
    this.mockedData = data;
  }

  list() {
    throw BaseService.notImplementedError;
  }

  // eslint-disable-next-line no-unused-vars
  get(id) {
    throw BaseService.notImplementedError;
  }
}
