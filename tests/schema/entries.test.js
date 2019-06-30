import gql from 'graphql-tag';
import _ from 'lodash';
import { createTestClientAndServer } from '../utils';
import mockedEntries from '../../fixtures/entries';
import mockedGuest from '../../fixtures/guests';
import Auth from '../../libs/auth';
import * as resolverUtils from '../../libs/resolverUtils';
import { humanFormat } from '../../libs/datetime';

describe('Entry Schema', () => {
  it('listEntry: should work', async () => {
    const { query, entryAPI, guestAPI } = createTestClientAndServer();
    Auth.verifyJwt = jest.fn().mockResolvedValue(true);
    entryAPI.list = jest.fn().mockResolvedValue(_.take(mockedEntries, 3));
    guestAPI.get = jest.fn().mockResolvedValue(mockedGuest[0]);
    const LIST_ENTRY = gql`
      query {
        listEntry {
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
    const res = await query({ query: LIST_ENTRY });
    expect(res).toMatchSnapshot();
    expect(Auth.verifyJwt).toBeCalled();
    expect(entryAPI.list).toBeCalled();
  });

  it('listEntry should be protected', async () => {
    const { query, entryAPI, guestAPI } = createTestClientAndServer({
      context: {
        headers: {
          Authorization: 'Bearer some-token',
        },
      },
    });
    Auth.verifyJwt = jest
      .fn()
      .mockRejectedValue(new Error('You are not authenticated'));
    entryAPI.list = jest.fn().mockResolvedValue(mockedEntries);
    guestAPI.get = jest.fn().mockResolvedValue(mockedGuest[0]);
    const LIST_ENTRY = gql`
      query {
        listEntry {
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
    const res = await query({ query: LIST_ENTRY });
    expect(res).toMatchSnapshot();
    expect(Auth.verifyJwt).toBeCalledWith('some-token');
    expect(entryAPI.list).not.toBeCalled();
    expect(guestAPI.get).not.toBeCalled();
  });

  it('listEntry: should Authentication error if user does not exist', async () => {
    const { query, entryAPI, guestAPI } = createTestClientAndServer();
    Auth.verifyJwt = jest.fn().mockResolvedValue(false);
    const LIST_ENTRY = gql`
      query {
        listEntry {
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
    entryAPI.list = jest.fn();
    guestAPI.get = jest.fn();
    const res = await query({ query: LIST_ENTRY });
    expect(res.errors[0].extensions.exception.name).toEqual(
      'AuthenticationError',
    );
    expect(entryAPI.list).not.toBeCalled();
    expect(guestAPI.get).not.toBeCalled();
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
    Auth.verifyJwt = jest.fn().mockResolvedValue(true);
    entryAPI.list = jest.fn().mockResolvedValue(mockedEntries);
    resolverUtils.filterToday = jest.fn().mockReturnValue([]);
    const res = await query({ query: LIST_TODAY_ENTRY });
    expect(res).toMatchSnapshot();
    expect(entryAPI.list).toBeCalled();
    expect(resolverUtils.filterToday).toBeCalledWith(mockedEntries);
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
    entryAPI.create = jest.fn().mockResolvedValue(attributes);
    guestAPI.findOrCreate = jest
      .fn()
      .mockResolvedValue({ ...attributes.Guest, id: 'some-id' });
    guestAPI.get = jest.fn().mockResolvedValue(attributes.Guest);

    const res = await mutate({
      mutation: CREATE_ENTRY,
      variables: { input: attributes },
    });

    expect(guestAPI.findOrCreate).toBeCalledWith(attributes.Guest);
    expect(entryAPI.create).toBeCalledWith({
      id: attributes.id,
      see: attributes.see,
      guestId: 'some-id',
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
