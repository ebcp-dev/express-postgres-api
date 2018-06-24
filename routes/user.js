const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// User sign up route
router.post('/signup', (req, res) => {
  res.send('Sign up route');
});

// User sign in route
router.post('/login', (req, res) => {
  res.send('Log in route');
});

module.exports = router;
