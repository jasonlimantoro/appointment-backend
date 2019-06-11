/* eslint-disable no-new */
import BaseService from '../../services/base';

describe('Base Service', () => {
  it('constructor: should validate the constructor arguments', () => {
    expect(() => {
      new BaseService({ mockedData: [{ a: 'b' }], mocked: false });
    }).toThrow(BaseService.invalidArgumentsError);
  });

  it('constructor: should successfully instantiate class', () => {
    let service;
    const mockedData = [{ a: 'b' }];
    expect(() => {
      service = new BaseService();
    }).not.toThrow();
    expect(service.mocked).toBe(false);
    expect(() => {
      service = new BaseService({ mockedData, mocked: true });
    }).not.toThrow();
    expect(service.mocked).toEqual(true);
    expect(service.mockedData).toEqual(mockedData);
  });

  it('list: should not be callable', () => {
    expect(() => {
      const service = new BaseService();
      service.list();
    }).toThrow(BaseService.notImplementedError);
  });

  it('get: should not be callable', () => {
    expect(() => {
      const service = new BaseService();
      service.get('some-id');
    }).toThrow(BaseService.notImplementedError);
  });
});
