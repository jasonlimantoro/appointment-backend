export default (sequelize, DataTypes) => {
  const session = sequelize.define(
    'session',
    {
      userId: DataTypes.STRING,
      endedAt: DataTypes.DATE,
    },
    {
      timestamps: true,
      updatedAt: false,
    },
  );
  session.associate = models => {
    session.hasMany(models.entry, { foreignKey: 'sessionId' });
    // associations can be defined here
  };
  return session;
};
