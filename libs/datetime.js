import moment from 'moment';

export const commonFormat = 'YYYY-MM-DDTHH:mm:ss';

export const humanFormat = (obj, format = commonFormat) => moment(obj).format(format);
