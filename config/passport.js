const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const Keys = require('../config/keys');

const opts = {
  jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey = Keys.secretOrKey
}

module.exports = passport => {}