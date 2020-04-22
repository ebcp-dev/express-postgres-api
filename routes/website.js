const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const passport = require('passport');

const { Website } = require('../sequelize');

// Validation imports
const validateWebsiteInput = require('../validation/addWebsite');

// Add website route
router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateWebsiteInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newWebsite = {
      url: req.body.url,
      name: req.body.name,
      userId: req.user.id
    };

    Website.findOrCreate({
      where: { userId: newWebsite.userId, url: newWebsite.url },
      defaults: newWebsite
    }).spread((website, created) => {
      if (!created) {
        errors.url = 'Website already added.';
        return res.status(400).json({ errors, website });
      } else {
        return res.status(200).json(website);
      }
    });
  }
);

// Get list of websites of current user
router.get(
  '/list',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    Website.findAll({
      where: { userId: req.user.id }
    }).then((websites) => {
      return res.status(200).json(websites);
    });
  }
);

module.exports = router;
