import gql from 'graphql-tag';
import uuid from 'uuid';
import Auth from '../../../libs/auth';
import { createTestClientAndServer, truncateDb } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import models from '../../../database/models';
import { guestFactory, sessionFactory } from '../../factories';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
const spiedUuid = jest.spyOn(uuid, 'v4');
const mockUuid = 'some-uuid';
beforeEach(async done => {
  await truncateDb();
  credentialUtils.getServiceWithAssumedCredentials = jest
    .fn()
    .mockResolvedValue(true);
  spiedJwtVerification.mockRejectedValue(
    new Error('Authenticated routes should be proteced'),
  );
  spiedUuid.mockReturnValue(mockUuid);
  done();
});
afterEach(() => {
  credentialUtils.getServiceWithAssumedCredentials.mockClear();
  spiedJwtVerification.mockReset();
});

afterAll(async () => {
  await models.sequelize.close();
});

describe('createEntry', () => {
  it('should work', async () => {
    const { mutate } = createTestClientAndServer();
    const session = await sessionFactory();
    const attributes = {
      see: 'xyz',
      sessionId: session.getDataValue('id'),
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
    const allEntries = () => entry.findAll();
    const allGuests = () => guest.findAll();
    spiedJwtVerification.mockResolvedValue({
      sub: 'some-user-id',
    });
    expect(await allGuests()).toHaveLength(0);
    expect(await allEntries()).toHaveLength(0);

    const res = await mutate({
      mutation: CREATE_ENTRY,
      variables: { input: attributes },
    });
    expect(res.errors).toBeUndefined();
    expect(await allGuests()).toHaveLength(1);
    expect((await allGuests())[0].getDataValue('NIK')).toEqual(
      attributes.Guest.NIK,
    );
    expect(await allEntries()).toHaveLength(1);
    expect((await allEntries())[0].getDataValue('id')).toEqual(mockUuid);
    expect(res.data.createEntry.id).toEqual(mockUuid);
  });
  it('should not create guest if guest already exists', async () => {
    const { mutate } = createTestClientAndServer();
    const session = await sessionFactory();
    const attributes = {
      see: 'xyz',
      sessionId: session.getDataValue('id'),
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
