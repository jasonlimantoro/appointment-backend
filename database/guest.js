export default (sequelize, type) => sequelize.define('guest', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: type.STRING,
  lastName: type.STRING,
  company: type.STRING,
  email: type.STRING,
  NIK: type.STRING,
});
