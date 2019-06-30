export const mockList = jest.fn();
export const mockGet = jest.fn();
export const mockPut = jest.fn();
export const mockUpdate = jest.fn();
export const mockWhere = jest.fn();
const mock = jest.fn().mockImplementation(() => ({
  list: mockList,
  get: mockGet,
  put: mockPut,
  update: mockUpdate,
  where: mockWhere,
}));

export default mock;
