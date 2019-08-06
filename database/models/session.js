export default (sequelize, DataTypes) => {
  const session = sequelize.define(
    'session',
    {
      userId: DataTypes.STRING,
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
