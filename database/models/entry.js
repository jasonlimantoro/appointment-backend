export default (sequelize, DataTypes) => {
  const entry = sequelize.define(
    'entry',
    {
      see: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {},
  );
  entry.associate = models => {
    // associations can be defined here
    entry.belongsTo(models.guest);
  };
  return entry;
};
