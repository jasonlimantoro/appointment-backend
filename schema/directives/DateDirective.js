import { SchemaDirectiveVisitor } from 'graphql-tools';
import { GraphQLString, defaultFieldResolver } from 'graphql';
import moment from 'moment';

class DateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { defaultFormat } = this.args;
    field.args.push({
      name: 'format',
      type: GraphQLString,
    });
    field.resolve = async (source, { format, ...restArgs }, context, info) => {
      const date = await resolve.call(this, source, restArgs, context, info);
      return moment(date).format(format || defaultFormat);
    };
  }
}

export default DateDirective;
