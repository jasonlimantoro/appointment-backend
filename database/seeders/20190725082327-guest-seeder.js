module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'guests',
    [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        NIK: '1231231231231231',
        company: 'Google',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    queryInterface.bulkDelete('guests', null, {}),
};
