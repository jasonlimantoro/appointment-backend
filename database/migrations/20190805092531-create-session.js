export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      endedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    }),
  down: queryInterface => queryInterface.dropTable('sessions'),
};
