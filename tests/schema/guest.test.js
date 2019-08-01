import gql from 'graphql-tag';
import { createTestClientAndServer, truncateDb } from '../utils';
import * as credentialUtils from '../../libs/credentials';
import Auth from '../../libs/auth';
import { entryFactory, guestFactory } from '../factories';

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
  it('listGuest: should work', async () => {
    const { query } = createTestClientAndServer();
    const jane = await guestFactory({ firstName: 'Jane' });
    await guestFactory({ firstName: 'John' });
    const entry = await entryFactory({ guestId: jane.getDataValue('NIK') });
    const LIST_GUEST = gql`
      query guests {
        listGuest {
          NIK
          firstName
          lastName
          email
          entryToday {
            id
            see
            createdAt
          }
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const result = await query({ query: LIST_GUEST });
    expect(result.data.listGuest).toHaveLength(2);
    expect(result.data.listGuest[0].entryToday[0].id).toEqual(entry.id);
    expect(result.errors).toBeUndefined();
  });

  it('getGuest: should work', async () => {
    const { query } = createTestClientAndServer();
    const john = await guestFactory({ firstName: 'John' });
    const GET_GUEST = gql`
      query guest($NIK: String!) {
        getGuest(NIK: $NIK) {
          NIK
          firstName
          lastName
          email
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const result = await query({
      query: GET_GUEST,
      variables: { NIK: john.getDataValue('NIK') },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data.getGuest.NIK).toEqual(john.NIK);
  });

  it('byName: should work', async () => {
    const { query } = createTestClientAndServer();
    const guest = await guestFactory({ firstName: 'John', lastName: 'Doe' });
    const BY_NAME = gql`
      query guestByName($input: ByNameInput!) {
        byName(input: $input) {
          NIK
          firstName
          lastName
          email
        }
      }
    `;
    spiedJwtVerification.mockResolvedValue(true);
    const result = await query({
      query: BY_NAME,
      variables: { input: { firstName: 'John', lastName: 'Doe' } },
    });
    expect(result.data.byName.NIK).toEqual(guest.NIK);
    expect(result.errors).toBeUndefined();
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
    expect(result).toMatchSnapshot();
  });
});
