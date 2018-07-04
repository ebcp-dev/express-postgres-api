const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');

// Test login credentials
const userCredentials = {
  test: {
    email: 'test@gmail.com',
    password: 'password'
  },
  invalid: {
    email: '',
    password: ''
  }
};
// Store authorization token
let jwt;

before(done => {
  request(server)
    .post('/user/login')
    .send(userCredentials.test)
    .expect(200)
    .end((err, res) => {
      expect(res.body.success).to.be.true;
      jwt = res.body.session;
      done();
    });
});

describe('Authentication routes', done => {
  it('Status 200 on successful login', async () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.test)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).to.be.true;
      });
  });

  it('Status 200 on authenticated route', async () => {
    request(server)
      .get('/user/current')
      .set('Authorization', jwt)
      .expect(200)
      .end((err, res) => {
        expect(res.body.email).equal(userCredentials.test.email);
      });
  });

  it('Status 400 on wrong credentials', async () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.invalid)
      .expect(400, done);
  });
});
