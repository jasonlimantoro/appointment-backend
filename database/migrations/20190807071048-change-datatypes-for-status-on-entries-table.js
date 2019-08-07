import { STATUS } from '../models/entry';

export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('entries', 'status', {
      type: Sequelize.ENUM(STATUS.ONGOING, STATUS.ENDED),
      defaultValue: STATUS.ONGOING,
    }),

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.changeColumn('entries', 'status', {
      type: Sequelize.STRING,
    }),
};
