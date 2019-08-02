import gql from 'graphql-tag';
import _ from 'lodash';
import { createTestClientAndServer, truncateDb } from '../utils';
import {
  entries as mockedEntries,
  guests as mockedGuest,
  photos as mockedPhotos,
} from '../../fixtures';
import Auth from '../../libs/auth';
import { humanFormat } from '../../libs/datetime';
import * as credentialUtils from '../../libs/credentials';

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
describe('Entry Schema', () => {
  it('listOngoingEntry: should work', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    const LIST_ONGOING = gql`
      query {
        listOngoingEntry {
          edges {
            node {
              see
              id
              createdAt
            }
          }
          pagination {
            hasNext
            count
          }
        }
      }
    `;
    entryAPI.onGoing = jest
      .fn()
      .mockResolvedValue({ Items: _.take(mockedEntries, 3), Count: 3 });
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({ query: LIST_ONGOING });
    expect(res.errors).toBeUndefined();
    expect(entryAPI.onGoing).toBeCalled();
  });

  it('Entry can automatically sign the photos url', async () => {
    const {
      query,
      entryAPI,
      uploadAPI,
      photoAPI,
    } = createTestClientAndServer();
    const QUERY = gql`
      query {
        listOngoingEntry {
          edges {
            node {
              see
              id
              photo {
                signedUrl(permissions: [GET]) {
                  get
                }
              }
            }
          }
          pagination {
            hasNext
            count
          }
        }
      }
    `;
    uploadAPI.sign = jest
      .fn()
      .mockResolvedValue({ signedRequest: 'signed-request-for-get' });
    entryAPI.onGoing = jest
      .fn()
      .mockResolvedValue({ Items: _.take(mockedEntries, 2), Count: 2 });
    photoAPI.byEntry = jest.fn().mockResolvedValue(_.take(mockedPhotos, 2));
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({ query: QUERY });
    expect(res.errors).toBeUndefined();
    expect(uploadAPI.sign).toBeCalled();
  });

  it('createEntry: should work', async () => {
    const { mutate, entryAPI, guestAPI } = createTestClientAndServer();
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
    spiedJwtVerification.mockResolvedValue({
      sub: 'some-user-id',
    });
    entryAPI.create = jest.fn().mockResolvedValue(attributes);
    guestAPI.findOrCreate = jest.fn().mockResolvedValue(attributes.Guest);
    guestAPI.get = jest.fn().mockResolvedValue(attributes.Guest);

    const res = await mutate({
      mutation: CREATE_ENTRY,
      variables: { input: attributes },
    });

    expect(guestAPI.findOrCreate).toBeCalledWith(attributes.Guest);
    expect(entryAPI.create).toBeCalledWith({
      id: attributes.id,
      see: attributes.see,
      guestId: attributes.Guest.NIK,
      userId: 'some-user-id',
    });

    expect(res).toMatchSnapshot();
  });

  it('getEntry: should work', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    const GET_ENTRY = gql`
      query GetEntry($id: String!) {
        getEntry(id: $id) {
          id
          see
          createdAt
          endedAt
        }
      }
    `;
    const mock = mockedEntries[0];
    entryAPI.get = jest.fn().mockResolvedValue(mock);
    spiedJwtVerification.mockResolvedValue(true);
    const res = await query({ query: GET_ENTRY, variables: { id: mock.id } });
    expect(res).toMatchSnapshot();
    expect(entryAPI.get).toBeCalledWith(mock.id);
  });

  it('endEntry: should work', async () => {
    const { mutate, entryAPI } = createTestClientAndServer();
    const END_ENTRY = gql`
      mutation EndEntry($id: String!) {
        endEntry(id: $id) {
          id
          see
          createdAt
          endedAt
        }
      }
    `;
    spiedJwtVerification.mockResolvedValueOnce(true);
    const mock = mockedEntries[0];
    entryAPI.end = jest.fn().mockResolvedValue({
      ...mock,
      endedAt: humanFormat(new Date(2020, 1, 1)),
    });
    const res = await mutate({
      mutation: END_ENTRY,
      variables: { id: mock.id },
    });

    expect(entryAPI.end).toBeCalledWith(mock.id);
    expect(res).toMatchSnapshot();
  });

  it('getByGuestId: should work', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    entryAPI.byGuestId = jest.fn().mockResolvedValue([]);
    const BY_GUEST_ID = gql`
      query byGuestId($NIK: String!) {
        byGuestId(NIK: $NIK) {
          id
          see
          createdAt
          Guest {
            NIK
          }
        }
      }
    `;
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({
      query: BY_GUEST_ID,
      variables: { NIK: mockedGuest[0].NIK },
    });
    expect(res).toMatchSnapshot();
    expect(entryAPI.byGuestId).toBeCalledWith(mockedGuest[0].NIK);
  });
});
