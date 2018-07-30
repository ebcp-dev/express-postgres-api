const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const { User, sequelize } = require('../sequelize');

// Data for testing POST /data
const testData = {
  data: 'Test string.'
};
const invalidData = {
  data: 12
};

// Test login credentials
const testInput = {
  test: {
    email: 'testemail@gmail.com',
    password: 'password'
  },
  testSignup: {
    email: 'testemail@gmail.com',
    password: 'password',
    password2: 'password'
  }
};
let token;

before(done => {
  User.sync({ force: true }).then(res => {
    request(server)
      .post('/api/user/signup')
      .send(testInput.testSignup)
      .end((err, res) => {
        request(server)
          .post('/api/user/login')
          .send(testInput.test)
          .end((err, res) => {
            token = res.body.session;
            done();
          });
      });
  });
});

describe('GET /', done => {
  it('Status 200 and JSON with success message', done => {
    request(server)
      .get('/api')
      .expect(200)
      .end(function(err, res) {
        expect(res.body.message).equal('success');
        done();
      });
  });
  it('Status 400 on no saved data', done => {
    request(server)
      .get('/api/data')
      .set('Authorization', token)
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('No data saved.');
        done();
      });
  });
});

describe('POST /data', done => {
  it('Status 200 on valid data', done => {
    request(server)
      .post('/api/data')
      .set('Authorization', token)
      .send(testData)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.string).equal(testData.data);
        done();
      });
  });
  it('Status 401 on unauthorized', done => {
    request(server)
      .post('/api/data')
      .send(invalidData)
      .expect(401, done);
  });
  it('Status 400 on invalid data', done => {
    request(server)
      .post('/api/data')
      .set('Authorization', token)
      .send(invalidData)
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('Invalid input.');
        done();
      });
  });
  it('Status 400 on empty data', done => {
    request(server)
      .post('/api/data')
      .set('Authorization', token)
      .send('')
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('Invalid input.');
        done();
      });
  });
  it('Status 400 on no passed data', done => {
    request(server)
      .post('/api/data')
      .set('Authorization', token)
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('Invalid input.');
        done();
      });
  });
});

describe('GET /data', done => {
  it('Return saved data', done => {
    request(server)
      .get('/api/data')
      .set('Authorization', token)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.string).equal(testData.data);
        done();
      });
  });
  it('Status 401 unauthorized', done => {
    request(server)
      .get('/api/data')
      .expect(401, done);
  });
});

after(done => {
  sequelize.close();
  done();
});
