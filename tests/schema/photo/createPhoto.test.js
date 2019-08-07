import gql from 'graphql-tag';
import { createTestClientAndServer } from '../../utils';
import Auth from '../../../libs/auth';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory } from '../../factories';
import '../../dbHooks';

const spiedJWTVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

beforeEach(async () => {
  spiedJWTVerification.mockRejectedValue(
    new Error('Authenticated routes should be protected'),
  );
});
afterEach(() => {
  spiedJWTVerification.mockClear();
});
describe('photo', () => {
  it('createPhoto: should work', async () => {
    const { mutate } = createTestClientAndServer();
    const attributes = {
      key: 'some-key',
    };
    const entry = await entryFactory();

    const CREATE_PHOTO = gql`
      mutation CreatePhoto($input: CreatePhotoInput!) {
        createPhoto(input: $input) {
          id
          key
          createdAt
        }
      }
    `;
    spiedJWTVerification.mockResolvedValue(true);
    const res = await mutate({
      mutation: CREATE_PHOTO,
      variables: {
        input: { key: attributes.key, entryId: entry.getDataValue('id') },
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.createPhoto.key).toEqual(attributes.key);
  });
});
