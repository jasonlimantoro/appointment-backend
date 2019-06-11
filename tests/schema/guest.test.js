/* eslint-disable no-undef */
import { graphql } from 'graphql';
import schema from '../../schema';

describe('Guest schema', () => {
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
    const result = await graphql(schema, query);
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
    const result = await graphql(schema, query);
    expect(result).toMatchSnapshot();
  });
});
