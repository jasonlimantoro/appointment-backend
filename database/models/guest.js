export default (sequelize, DataTypes) => {
  const guest = sequelize.define(
    'guest',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      company: DataTypes.STRING,
      NIK: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {},
  );
  guest.associate = models => {
    guest.hasMany(models.entry, { foreignKey: 'guestId' });
  };
  return guest;
};
