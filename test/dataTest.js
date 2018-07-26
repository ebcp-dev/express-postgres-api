const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');

// Data for testing POST /data
const testData = {
  data: 'Test string.'
};
const invalidData = {
  data: 12
};

describe('GET /api', done => {
  it('Status 200 and JSON with success message', done => {
    request(server)
      .get('/api')
      .expect(200)
      .end(function(err, res) {
        expect(res.body.message).equal('success');
      });
    done();
  });

  it('Status 400 on no saved data', done => {
    request(server)
      .get('/api/data')
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('No data saved.');
      });
    done();
  });
});

describe('POST /api/data', done => {
  it('Status 200 on valid data', done => {
    request(server)
      .post('/api/data')
      .send(testData)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.string).equal(testData.data);
      });
    done();
  });

  it('Status 400 on invalid data', done => {
    request(server)
      .post('/api/data')
      .send(invalidData)
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('Invalid input.');
      });
    done();
  });

  it('Status 400 on empty data', done => {
    request(server)
      .post('/api/data')
      .send('')
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('Invalid input.');
      });
    done();
  });

  it('Status 400 on no passed data', done => {
    request(server)
      .post('/api/data')
      .expect(400)
      .end(function(err, res) {
        expect(res.body.error).equal('Invalid input.');
      });
    done();
  });
});

describe('GET /data', done => {
  it('Return saved data', done => {
    request(server)
      .get('/api/data')
      .expect(200)
      .end(function(err, res) {
        expect(res.body.string).equal(testData.data);
      });
    done();
  });
});
