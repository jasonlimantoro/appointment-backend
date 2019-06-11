/* eslint-disable no-undef */
import { graphql } from 'graphql';
import schema from '../../schema';
import GuestService from '../../services/guest';

describe('Guest schema', () => {
  let produceGraphql;
  beforeEach(() => {
    produceGraphql = async ({ query = '', Service = GuestService }) => graphql({
      schema,
      source: query,
      contextValue: {
        dataSources: {
          GuestAPI: new Service(),
        },
      },
    });
  });
  it('listGuest: should work', async () => {
    const query = `
    	query {
    		listGuest {
    			id
    			firstName
    			lastName
    			email
    		}
    	}
    `;
    const result = await produceGraphql({ query });
    expect(result).toMatchSnapshot();
  });

  it('getGuest: should work', async () => {
    const query = `
      query {
        getGuest(id:"ah") {
          id
          firstName
          lastName
          email
        }
      }
    `;
    const result = await produceGraphql({ query });
    expect(result).toMatchSnapshot();
  });
});
