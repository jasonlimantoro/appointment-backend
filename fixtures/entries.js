const guests = require('./guests');

module.exports = [
  {
    id: '123',
    Guest: guests[0],
    see: 'person1',
    createdAt: new Date(2018, 1, 1, 10, 0).toLocaleString(),
    endedAt: new Date(2018, 1, 1, 12, 0).toLocaleString(),
  },
  {
    id: '234',
    Guest: guests[0],
    see: 'person2',
    createdAt: new Date(2018, 1, 2, 11, 0).toLocaleString(),
    endedAt: undefined,
  },
  {
    id: '456k',
    Guest: guests[1],
    see: 'person2',
    createdAt: new Date(2018, 2, 1, 11, 0).toLocaleString(),
    endedAt: new Date(2018, 2, 1, 12, 0).toLocaleString(),
  },
];
