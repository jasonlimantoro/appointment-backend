const guests = require('./guests');

module.exports = [
  {
    id: '123',
    guestId: guests[0].id,
    see: 'person1',
    createdAt: '2018-09-10 04:05:33',
    endedAt: '2018-09-10 05:06:44',
  },
  {
    id: '234',
    guestId: guests[0].id,
    see: 'person2',
    createdAt: '2018-02-07 16:00:04',
  },
  {
    id: '456k',
    guestId: guests[1].id,
    see: 'person2',
    createdAt: '2019-06-21 17:00:45',
    endedAt: '2019-06-21 18:00:00',
  },
];
