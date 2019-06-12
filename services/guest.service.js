import BaseService from './base';

class GuestService extends BaseService {
  constructor({ mockedData = [], mocked = false } = {}) {
    super({ mockedData, mocked });
  }

  list() {
    return this.mockedData;
  }

  get(id) {
    return this.list().find(d => d.id === id);
  }
}

export default GuestService;
