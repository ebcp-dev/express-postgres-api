module.exports = (sequelize, type) => {
  return sequelize.define('user', {
    id: {
      type: type.UUID,
      primaryKey: true,
      defaultValue: type.UUIDV4
    },
    email: {
      type: type.STRING,
      unique: true
    },
    password: {
      type: type.STRING
    }
  });
};
