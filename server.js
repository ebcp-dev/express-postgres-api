const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const port = 5000 || process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// API routes
const user = require('./routes/user');
const data = require('./routes/data'); // Initial data route for API
app.use('/', data);
app.use('/user', user);

app.listen(port, () => console.log(`Server running on port ${port}.`));

module.exports = app;
