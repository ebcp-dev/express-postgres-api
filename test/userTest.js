const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const { User } = require('../sequelize');

// Test login credentials
const userCredentials = {
  test: {
    email: 'testemail@gmail.com',
    password: 'password'
  },
  testSignup: {
    email: 'testemail@gmail.com',
    password: 'password',
    password2: 'password'
  },
  invalid: {
    email: '',
    password: ''
  }
};

before(done => {
  User.sync();
  done();
});

describe('Authentication routes', done => {
  it('Status 200 on successful signup', () => {
    request(server)
      .post('/api/user/signup')
      .send(userCredentials.testSignup)
      .expect(200)
      .end((err, res) => {
        expect(res.body.email).equal(userCredentials.testSignup.email);
        done();
      });
  });

  it('Status 200 on successful login', () => {
    request(server)
      .post('/api/user/login')
      .send(userCredentials.test)
      .expect(200)
      .end((err, res) => {
        console.log(res.body);
        expect(res.body.success).to.be.true;
      });
  });

  it('Status 400 on wrong credentials', () => {
    request(server)
      .post('/api/user/login')
      .send(userCredentials.invalid)
      .expect(400, done);
  });

  it('Status 401 on unauthorized access', done => {
    request(server)
      .get('/api/user/current')
      .expect(401, done);
  });
});
