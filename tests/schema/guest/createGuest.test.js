import gql from 'graphql-tag';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import Auth from '../../../libs/auth';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

describe('Guest schema', () => {
  beforeEach(async () => {
    spiedJwtVerification.mockRejectedValue(
      new Error('Authenticated routes should be protected'),
    );
    await truncateDb();
  });
  afterEach(async () => {
    spiedJwtVerification.mockClear();
    await truncateDb();
  });
  it('create guest: should work', async () => {
    const { mutate } = createTestClientAndServer();
    const attributes = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      NIK: '12345',
    };

    const CREATE_GUEST = gql`
      mutation CreateGuest($input: CreateGuestInput!) {
        createGuest(input: $input) {
          firstName
          lastName
          email
          NIK
          company
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const result = await mutate({
      mutation: CREATE_GUEST,
      variables: { input: attributes },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data.createGuest.NIK).toEqual(attributes.NIK);
  });
});
