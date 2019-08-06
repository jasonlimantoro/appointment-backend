module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.addColumn('entries', 'sessionId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'sessions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    }),

  down: queryInterface =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('entries', 'sessionId'),
};
