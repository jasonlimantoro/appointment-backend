import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import models from '../../../database/models';
import { guestFactory } from '../../factories';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
beforeEach(async () => {
  await truncateDb();
  credentialUtils.getServiceWithAssumedCredentials = jest
    .fn()
    .mockResolvedValue(true);
  spiedJwtVerification.mockRejectedValue(
    new Error('Authenticated routes should be proteced'),
  );
});
afterEach(() => {
  credentialUtils.getServiceWithAssumedCredentials.mockClear();
  spiedJwtVerification.mockReset();
});
describe('createEntry', () => {
  it('should work', async () => {
    const { mutate } = createTestClientAndServer();
    const attributes = {
      id: 'asdf',
      see: 'xyz',
      Guest: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        company: 'Amazon',
        NIK: 'abcdefghijklmnop',
      },
    };
    const CREATE_ENTRY = gql`
      mutation CreateEntry($input: CreateEntryInput!) {
        createEntry(input: $input) {
          id
          see
          Guest {
            firstName
            lastName
            email
          }
        }
      }
    `;
    const { entry, guest } = models;
    spiedJwtVerification.mockResolvedValue({
      sub: 'some-user-id',
    });

    const res = await mutate({
      mutation: CREATE_ENTRY,
      variables: { input: attributes },
    });
    const allEntries = await entry.findAll();
    const allGuests = await guest.findAll();

    expect(allGuests).toHaveLength(1);
    expect(allGuests[0].getDataValue('NIK')).toEqual(attributes.Guest.NIK);
    expect(allEntries).toHaveLength(1);
    expect(allEntries[0].getDataValue('id')).toEqual(attributes.id);
    expect(res.errors).toBeUndefined();
    expect(res.data.createEntry.id).toEqual(attributes.id);
  });
  it('should not create guest if guest already exists', async () => {
    const { mutate } = createTestClientAndServer();
    const attributes = {
      id: 'asdf',
      see: 'xyz',
      Guest: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        company: 'Amazon',
        NIK: 'abcdefghijklmnop',
      },
    };
    await guestFactory(attributes.Guest);
    const { entry, guest } = models;
    const CREATE_ENTRY = gql`
      mutation CreateEntry($input: CreateEntryInput!) {
        createEntry(input: $input) {
          id
          see
          Guest {
            firstName
            lastName
            email
          }
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue({
      sub: 'some-user-id',
    });
    const res = await mutate({
      mutation: CREATE_ENTRY,
      variables: { input: attributes },
    });
    const allGuests = await guest.findAll();
    const allEntries = await entry.findAll();
    expect(res.errors).toBeUndefined();
    expect(allGuests).toHaveLength(1);
    expect(allEntries).toHaveLength(1);
  });
});
