import gql from 'graphql-tag';
import { commonFormat } from '../../libs/datetime';

const typeDefs = gql`
  directive @date(
    defaultFormat: String = "${commonFormat}"
  ) on FIELD_DEFINITION
`;

export default typeDefs;
