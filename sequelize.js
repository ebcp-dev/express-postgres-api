const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const Keys = require('./config/keys');

const sequelize = new Sequelize(Keys.db, Keys.dbuser, Keys.dbpass, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: true }).then(() => {
  console.log(`Database & tables created!`);
});

module.exports = {
  User
};
