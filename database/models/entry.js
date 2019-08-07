export const STATUS = {
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
};
export default (sequelize, DataTypes) => {
  const entry = sequelize.define(
    'entry',
    {
      see: DataTypes.STRING,
      status: DataTypes.STRING,
      endedAt: DataTypes.DATE,
      sessionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sessions',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      updatedAt: false,
    },
  );
  entry.associate = models => {
    entry.belongsTo(models.session, { foreignKy: 'sessionId' });
    entry.belongsTo(models.guest, { foreignKey: 'guestId' });
    entry.hasMany(models.photo, { foreignKey: 'entryId' });
  };
  return entry;
};
