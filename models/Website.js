module.exports = (sequelize, type) => {
  return sequelize.define('website', {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4
    },
    name: {
      type: type.STRING,
      unique: true
    },
    url: {
      type: type.STRING,
      unique: true
    },
    status: {
      type: type.STRING,
      defaultValue: 'Online'
    }
  });
};
