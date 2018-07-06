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

describe('Authentication routes', done => {
  it('Status 200 on successful signup', () => {
    request(server)
      .post('/user/signup')
      .send(userCredentials.test)
      .expect(200)
      .end((err, res) => {
        console.log(res.body);
        expect(res.body.email).equal(userCredentials.test.email);
      });
  });

  it('Status 200 on successful login', () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.test)
      .expect(200)
      .then(res => {
        expect(res.body.success).to.be.true;
      });
  });

  it('Status 400 on wrong credentials', () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.invalid)
      .expect(400, done);
  });
});

describe('Protected routes', () => {
  it('Status 200 on protected route while authenticated', () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.test)
      .expect(200)
      .then(res => {
        request(server)
          .get('/user/current')
          .set('Authorization', res.body.session) // Pass in authentication from login response
          .expect(200)
          .end((err, res) => {
            expect(res.body.email).equal(userCredentials.test.email);
          });
      })
      .catch(err => console.log(err));
  });

  it('Status 401 on unauthorized access', done => {
    request(server)
      .get('/user/current')
      .expect(401, done);
  });
});
