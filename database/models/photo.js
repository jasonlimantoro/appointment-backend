export default (sequelize, DataTypes) => {
  const photo = sequelize.define(
    'photo',
    {
      key: DataTypes.STRING,
    },
    {},
  );
  photo.associate = models => {
    // associations can be defined here
    photo.belongsTo(models.entry, { foreignKey: 'entryId' });
  };
  return photo;
};
