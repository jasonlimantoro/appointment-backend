import gql from 'graphql-tag';
import _ from 'lodash';
import { createTestClientAndServer } from '../utils';
import {
  entries as mockedEntries,
  guests as mockedGuest,
  photos as mockedPhotos,
} from '../../fixtures';
import Auth from '../../libs/auth';
import * as resolverUtils from '../../libs/resolverUtils';
import { humanFormat } from '../../libs/datetime';

beforeEach(() => {
  Auth.verifyJwt = jest.fn().mockRejectedValue(new Error());
});
describe('Entry Schema', () => {
  it('listEntry: should work', async () => {
    const {
      query, entryAPI, guestAPI, photoAPI,
    } = createTestClientAndServer();
    Auth.verifyJwt = jest.fn().mockResolvedValueOnce(true);
    entryAPI.list = jest.fn().mockResolvedValue(_.take(mockedEntries, 3));
    guestAPI.get = jest.fn().mockResolvedValue(mockedGuest[0]);
    photoAPI.byEntry = jest.fn().mockResolvedValue(_.take(mockedPhotos, 2));
    const LIST_ENTRY = gql`
      query {
        listEntry {
          Guest {
            firstName
            lastName
            NIK
          }
          photo {
            id
          }
          see
          createdAt
          endedAt
        }
      }
    `;
    const res = await query({ query: LIST_ENTRY });
    expect(res).toMatchSnapshot();
    expect(Auth.verifyJwt).toBeCalled();
    expect(entryAPI.list).toBeCalled();
    expect(photoAPI.byEntry).toBeCalled();
  });

  it('listEntryToday: should work', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    const LIST_TODAY_ENTRY = gql`
      query {
        listTodayEntry {
          Guest {
            firstName
            lastName
            NIK
          }
          see
          createdAt
          endedAt
        }
      }
    `;
    Auth.verifyJwt = jest.fn().mockResolvedValueOnce(true);
    entryAPI.list = jest.fn().mockResolvedValue(mockedEntries);
    resolverUtils.filterToday = jest.fn().mockReturnValue([]);
    const res = await query({ query: LIST_TODAY_ENTRY });
    expect(res).toMatchSnapshot();
    expect(entryAPI.list).toBeCalled();
    expect(resolverUtils.filterToday).toBeCalledWith(mockedEntries);
  });

  it('listEntryToday: can be filtered by guestID', async () => {
    const { query, entryAPI } = createTestClientAndServer();
    const LIST_TODAY_ENTRY = gql`
      query ListTodayEntry($NIK: String) {
        listTodayEntry(NIK: $NIK) {
          see
          createdAt
          endedAt
        }
      }
    `;
    Auth.verifyJwt = jest.fn().mockResolvedValueOnce(true);
    const byGuestId = _.take(mockedEntries, 3);
    const today = _.take(mockedEntries, 1);
    entryAPI.byGuestId = jest.fn().mockResolvedValue(byGuestId);
    resolverUtils.filterToday = jest.fn().mockReturnValue(today);
    const res = await query({
      query: LIST_TODAY_ENTRY,
      variables: { NIK: mockedGuest[0].NIK },
    });
    expect(entryAPI.byGuestId).toBeCalledWith(mockedGuest[0].NIK);
    expect(resolverUtils.filterToday).toBeCalledWith(byGuestId);
    expect(res).toMatchSnapshot();
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
    Auth.verifyJwt = jest.fn().mockResolvedValue(true);
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
    const res = await query({ query: GET_ENTRY, variables: { id: mock.id } });

    expect(entryAPI.get).toBeCalledWith(mock.id);

    expect(res).toMatchSnapshot();
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
    Auth.verifyJwt = jest.fn().mockResolvedValueOnce(true);
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
    const res = await query({
      query: BY_GUEST_ID,
      variables: { NIK: mockedGuest[0].NIK },
    });
    expect(res).toMatchSnapshot();
    expect(entryAPI.byGuestId).toBeCalledWith(mockedGuest[0].NIK);
  });
});
