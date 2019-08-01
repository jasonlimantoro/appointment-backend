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
    entry.belongsTo(models.guest, { foreignKey: 'guestId' });
  };
  return entry;
};
