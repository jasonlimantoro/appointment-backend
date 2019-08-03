import moment from 'moment';

export const commonFormat = 'YYYY-MM-DDTHH:mm:ss';

export const humanFormat = (obj, format = commonFormat) =>
  moment(obj).format(format);
export const startDay = moment()
  .hours(0)
  .minutes(0)
  .seconds(0);

export const endDay = moment()
  .hours(23)
  .minutes(59)
  .seconds(59);
