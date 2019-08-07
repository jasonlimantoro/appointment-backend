import moment from 'moment';
import gql from 'graphql-tag';
import Auth from '../../../libs/auth';
import { createTestClientAndServer } from '../../utils';
import * as credentialUtils from '../../../libs/credentials';
import { entryFactory, guestFactory } from '../../factories';
import '../../dbHooks';

const spiedJwtVerification = jest.spyOn(Auth, 'verifyJwt');
beforeEach(async () => {
  credentialUtils.getServiceWithAssumedCredentials = jest
    .fn()
    .mockResolvedValue(true);
  spiedJwtVerification.mockRejectedValue(
    new Error('Authenticated routes should be proteced'),
  );
});
afterEach(async () => {
  credentialUtils.getServiceWithAssumedCredentials.mockClear();
  spiedJwtVerification.mockReset();
});
describe('listEntryToday', () => {
  it('listEntryToday: should work', async () => {
    const { query } = createTestClientAndServer();
    await entryFactory(
      {
        createdAt: moment().subtract(1, 'day'),
      },
      {},
    );
    const today = await entryFactory({
      createdAt: moment(),
    });
    const today2 = await entryFactory({
      createdAt: moment(),
    });
    const LIST_TODAY_ENTRY = gql`
      query {
        listTodayEntry(paginate: { after: "some-id" }) {
          edges {
            node {
              Guest {
                firstName
                lastName
                NIK
              }
              id
              see
              createdAt
              endedAt
            }
          }
        }
      }
    `;
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({ query: LIST_TODAY_ENTRY });
    expect(res.errors).toBeUndefined();
    expect(res.data.listTodayEntry.edges).toHaveLength(2);
    expect(res.data.listTodayEntry.edges[0].node.id).toEqual(
      today.getDataValue('id'),
    );
    expect(res.data.listTodayEntry.edges[1].node.id).toEqual(
      today2.getDataValue('id'),
    );
  });
  it('listEntryToday: can be filtered by guestID', async () => {
    const { query } = createTestClientAndServer();
    const john = await guestFactory({ firstName: 'John' });
    const johnEntry = await entryFactory({
      guestId: john.getDataValue('NIK'),
    });
    await entryFactory({}, {}, 3);
    const LIST_TODAY_ENTRY = gql`
      query ListTodayEntry($NIK: String) {
        listTodayEntry(NIK: $NIK) {
          edges {
            node {
              id
              see
              createdAt
              Guest {
                NIK
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
    spiedJwtVerification.mockResolvedValueOnce(true);
    const res = await query({
      query: LIST_TODAY_ENTRY,
      variables: { NIK: johnEntry.getDataValue('guestId') },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.listTodayEntry.edges).toHaveLength(1);
    expect(res.data.listTodayEntry.edges[0].node.id).toEqual(
      johnEntry.getDataValue('id'),
    );
    expect(res.data.listTodayEntry.edges[0].node.Guest.NIK).toEqual(
      john.getDataValue('NIK'),
    );
  });
});
