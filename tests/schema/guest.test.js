import gql from 'graphql-tag';
import { createTestClientAndServer } from '../utils';
import * as credentialUtils from '../../libs/credentials';
import Auth from '../../libs/auth';
import mockedGuests from '../../fixtures/guests';
import mockedEntries from '../../fixtures/entries';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
credentialUtils.getServiceWithAssumedCredentials = jest
  .fn()
  .mockResolvedValue(true);

beforeEach(() => {
  spiedJwtVerification.mockRejectedValue(
    new Error('Authenticated routes should be protected'),
  );
});
afterEach(() => {
  spiedJwtVerification.mockClear();
});

describe('Guest schema', () => {
  it('listGuest: should work', async () => {
    const { query, guestAPI, entryAPI } = createTestClientAndServer();
    guestAPI.list = jest.fn(() => mockedGuests);
    entryAPI.byGuestId = jest.fn().mockResolvedValue(mockedEntries);
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
    expect(result).toMatchSnapshot();
    expect(guestAPI.list).toBeCalled();
    expect(entryAPI.byGuestId).toBeCalled();
  });

  it('getGuest: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    guestAPI.get = jest.fn(() => mockedGuests[0]);
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
      variables: { NIK: 'some-id' },
    });
    expect(result).toMatchSnapshot();
    expect(guestAPI.get).toBeCalledWith('some-id');
  });

  it('byName: should work', async () => {
    const { query, guestAPI } = createTestClientAndServer();
    const guest = mockedGuests[0];
    const { firstName, lastName } = guest;
    guestAPI.byName = jest.fn().mockResolvedValue(guest);
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
      variables: { input: { firstName, lastName } },
    });
    expect(result).toMatchSnapshot();
    expect(guestAPI.byName).toBeCalledWith({ firstName, lastName });
  });

  it('create guest: should work', async () => {
    const { mutate, guestAPI } = createTestClientAndServer();
    const attributes = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      NIK: '12345',
    };
    guestAPI.create = jest
      .fn()
      .mockResolvedValue({ ...attributes, id: 'some-id' });

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
    expect(guestAPI.create).toBeCalledWith(attributes);
  });
});
