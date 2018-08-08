const Sequelize = require('sequelize');

const UserModel = require('./models/User');
const WebsiteModel = require('./models/Website');
const Keys = require('./config/keys');

const sequelize = new Sequelize(Keys.db, Keys.dbuser, Keys.dbpass, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

// Create User model from definition in /models/User.js
const User = UserModel(sequelize, Sequelize);
const Website = WebsiteModel(sequelize, Sequelize);
// Set User's primary key (id) as Website's foreign key
Website.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync().then(() => {
  console.log(`Database & tables created!`);
});

module.exports = {
  User,
  Website,
  sequelize
};
