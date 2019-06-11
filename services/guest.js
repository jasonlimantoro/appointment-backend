import BaseService from './base';

const defaultData = [
  {
    id: 'ah',
    firstName: 'Andy',
    lastName: 'Huang',
    email: 'andy@gmail.com',
    NIK: '12312365',
    company: 'IMCP',
  },
  {
    id: 'bh',
    firstName: 'Budy',
    lastName: 'Harjo',
    email: 'budy@gmail.com',
    NIK: '12832837',
    company: 'Google',
  },
  {
    id: 'cp',
    firstName: 'Charlie',
    lastName: 'Putt',
    email: 'charlie@gmail.com',
    NIK: '128373987',
    company: 'Facebook',
  },
];
class MockGuestService extends BaseService {
  constructor({ mockedData = defaultData } = {}) {
    super({ mockedData });
  }

  list() {
    return this.mockedData;
  }

  get(id) {
    return this.mockedData.find(d => d.id === id);
  }
}

export default MockGuestService;
