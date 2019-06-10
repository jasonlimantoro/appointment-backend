const guests = [
  {
    id: 'ah',
    firstName: 'Andy',
    lastName: 'Huang',
    email: 'andy@gmail.com',
    NIK: '12312365',
    company: 'IMCP',
  },
  {
    id: 'bh',
    firstName: 'Budy',
    lastName: 'Harjo',
    email: 'budy@gmail.com',
    NIK: '12832837',
    company: 'Google',
  },
  {
    id: 'cp',
    firstName: 'Charlie',
    lastName: 'Putt',
    email: 'charlie@gmail.com',
    NIK: '128373987',
    company: 'Facebook',
  },
];

const resolvers = {
  Query: {
    listGuest: () => guests,
    getGuest: (_, args) => guests.find(g => g.id === args.id),
  },
};

export default resolvers;
