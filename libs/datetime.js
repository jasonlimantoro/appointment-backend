import moment from 'moment';

export const humanFormat = obj => moment(obj).format('YYYY-MM-DDTHH:mm:ss');
