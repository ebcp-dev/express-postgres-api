const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000 || process.env.PORT;

let data = {};

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success'
  });
});

app.post('/data', (req, res) => {
  console.log(req.body)
  data.string = req.body.data;
  res.json(data);
});

app.get('/data', (req, res) => {
  res.json(data);
});

app.listen(port, () => console.log(`Server running on port ${port}.`));