const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('api-db', 'postgres', 'admin', {
  // (database, username, passport)
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000
  }
});

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  }
});

sequelize
  .authenticate()
  .then(() => {
    User.sync();
    console.log('Success!');
  })
  .catch(err => {
    console.log(err);
  });

const app = express();
const port = 5000 || process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API routes
const test = require('./routes/test'); // Initial test route for API
app.use('/test', test);

// User sign up route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password
  };
  // Hash password before storing into db
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
    });
  });
  User.findOrCreate({
    where: { email: newUser.email },
    defaults: newUser
  }).spread((user, created) => {
    if (!created)
      res.status(400).json({
        error: 'Email already exists.'
      });
    else {
      res.status(200).json(user);
    }
  });
});

// User sign in route
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
});

// Get all user objects in db
app.get('/all', (req, res) => {
  User.findAll().then(users => {
    res.json({
      message: 'All users in the database.',
      users
    });
  });
});

app.listen(port, () => console.log(`Server running on port ${port}.`));
