const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { User } = require('../sequelize');
const Keys = require('../config/keys');

// Validation imports
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// User sign up route
router.post('/signup', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

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
    if (!created) {
      errors.email = 'Email already in use.';
      return res.status(400).json(errors);
    } else {
      return res.status(200).json(user);
    }
  });
});

// User sign in route
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  // Plain text login password
  const password = req.body.password;

  // Find user by email
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        errors.email = 'User not found.';
        return res.status(404).json(errors);
      }
      // Check password
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // JWT payload
            const payload = {
              email: user.email
            };
            // Sign token
            jwt.sign(
              payload,
              Keys.secretOrKey,
              { expiresIn: 1800 },
              (err, token) => {
                return res.status(200).json({
                  success: true,
                  session: 'Bearer ' + token
                });
              }
            );
          } else {
            errors.password = 'Incorrect password.';
            return res.status(400).json(errors);
          }
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

// Get current user
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Return authorized user
    return res.status(200).json(req.user);
  }
);

// Get all user objects in db
// router.get('/all', (req, res) => {
//   User.findAll()
//     .then(users => {
//       res.status(200).json(users);
//     })
//     .catch(err => console.log(err));
// });

module.exports = router;
