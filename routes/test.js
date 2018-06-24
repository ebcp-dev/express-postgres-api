const express = require('express');
const router = express.Router();

let data = {};

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success'
  });
});

router.post('/data', (req, res) => {
  console.log(req.body);
  data.string = req.body.data;
  res.json(data);
});

router.get('/data', (req, res) => {
  res.json(data);
});

module.exports = router;
