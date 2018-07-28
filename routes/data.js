const express = require('express');
const router = express.Router();
const passport = require('passport');

let data = {};

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'success'
  });
});

router.post(
  '/data',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (typeof req.body.data === 'string' && req.body.data.length > 0) {
      data.string = req.body.data;
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: 'Invalid input.' });
    }
  }
);

router.get(
  '/data',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (data.string) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: 'No data saved.' });
    }
  }
);

module.exports = router;
