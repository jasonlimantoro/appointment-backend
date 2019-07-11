/* eslint-disable no-new */
import { NotImplementedError } from '../../libs/errors';
import BaseService from '../../services/base';

const service = new BaseService();

describe('Base Service', () => {
  it('list: should not be callable', async () => {
    await expect(service.list()).rejects.toThrow(NotImplementedError);
  });

  it('get: should not be callable', async () => {
    await expect(service.get()).rejects.toThrow(NotImplementedError);
  });

  it('create: should not be callable', async () => {
    await expect(service.create()).rejects.toThrow(NotImplementedError);
  });

  it('replaceDataSource: should be able to replace data source', () => {
    class DataSource {}
    const newDataSource = new DataSource();
    service.replaceDataSource(newDataSource);
    expect(service.dataSource).toBeInstanceOf(DataSource);
    expect(service._util.dataSource).toBeInstanceOf(DataSource);
  });
});
