export default (sequelize, DataTypes) => {
  const entry = sequelize.define(
    'entry',
    {
      see: DataTypes.STRING,
      status: DataTypes.STRING,
      endedAt: DataTypes.DATE,
    },
    {
      timestamps: true,
      updatedAt: false,
    },
  );
  entry.associate = models => {
    entry.belongsTo(models.guest, { foreignKey: 'guestId' });
    entry.hasMany(models.photo, { foreignKey: 'entryId' });
  };
  return entry;
};
