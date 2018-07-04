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
  it('Status 200 on succesful login', async () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.test)
      .expect(200)
      .end((err, res) => {
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it('Status 400 on wrong credentials', async () => {
    request(server)
      .post('/user/login')
      .send(userCredentials.invalid)
      .expect(400, done);
  });
});
