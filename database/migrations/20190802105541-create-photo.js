export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      key: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      entryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'entries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    }),
  down: queryInterface => queryInterface.dropTable('photos'),
};
