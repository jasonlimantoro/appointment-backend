export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('entries', {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
    },
    see: {
      type: Sequelize.STRING,
    },
    status: {
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
    guestId: {
      type: Sequelize.STRING,
      references: {
        model: 'guests',
        key: 'NIK',
      },
      onDelete: 'CASCADE',
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('entries'),
};
