const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const { User, Website, sequelize } = require('../sequelize');

// Test login credentials
const testInput = {
  test: {
    email: 'testemail@gmail.com',
    password: 'password'
  },
  wrongEmail: {
    email: 'testemai@gmail.com',
    password: 'password'
  },
  wrongPassword: {
    email: 'testemail@gmail.com',
    password: 'passwords'
  },
  testSignup: {
    email: 'testemail@gmail.com',
    password: 'password',
    password2: 'password'
  },
  signupUnconfirmedPasswords: {
    email: 'testemail@gmail.com',
    password: 'password',
    password2: 'password2'
  },
  emptyInput: {
    email: '',
    password: ''
  },
  testWebsite: {
    url: 'https://slack.com',
    name: 'Slack'
  },
  invalidWebsite: {
    url: 'https://slack',
    name: 'Slack'
  }
};
let token;

before(done => {
  User.sync({ force: true }).then(res => {
    Website.destroy({ where: {}, truncate: true });
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

describe('/user/login and /user/signup Authentication routes', done => {
  it('Status 200 on successful login', done => {
    request(server)
      .post('/api/user/login')
      .send(testInput.test)
      .expect(200)
      .end((err, res) => {
        token = res.body.session;
        expect(res.body.success).to.be.true;
        done();
      });
  });
  it('Status 400 on wrong login email', done => {
    request(server)
      .post('/api/user/login')
      .send(testInput.wrongEmail)
      .expect(400, done);
  });
  it('Status 400 on wrong login password', done => {
    request(server)
      .post('/api/user/login')
      .send(testInput.wrongPassword)
      .expect(400, done);
  });
  it('Status 400 on empty login input', done => {
    request(server)
      .post('/api/user/login')
      .send(testInput.emptyInput)
      .expect(400, done);
  });
  it('Status 400 on existing signup email', done => {
    request(server)
      .post('/api/user/signup')
      .send(testInput.testSignup)
      .expect(400, done);
  });
  it('Status 400 on empty signup input', done => {
    request(server)
      .post('/api/user/signup')
      .send(testInput.emptyInput)
      .expect(400, done);
  });
  it('Status 400 on confirm password signup failure', done => {
    request(server)
      .post('/api/user/signup')
      .send(testInput.signupUnconfirmedPasswords)
      .expect(400, done);
  });
  it('Status 200 on authorized access for /current', done => {
    request(server)
      .get('/api/user/current')
      .set('Authorization', token)
      .expect(200, done);
  });
  it('Status 401 on unauthorized access for /current', done => {
    request(server)
      .get('/api/user/current')
      .expect(401, done);
  });
});

describe('GET /website/list route before adding', done => {
  it('Status 200 with empty array when no data is saved', done => {
    request(server)
      .get('/api/website/list')
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.length).equal(0);
        done();
      });
  });

  it('Status 401 on unauthorized access', done => {
    request(server)
      .get('/api/website/list')
      .expect(401, done);
  });
});

describe('POST /website/add routes', done => {
  it('Status 200 on successful add', done => {
    request(server)
      .post('/api/website/add')
      .set('Authorization', token)
      .send(testInput.testWebsite)
      .expect(200)
      .end((err, res) => {
        expect(res.body.name).equal(testInput.testWebsite.name);
        done();
      });
  });
  it('Status 400 on empty input', done => {
    request(server)
      .post('/api/website/add')
      .set('Authorization', token)
      .send(testInput.emptyInput)
      .expect(400, done);
  });
  it('Status 400 on invalid url', done => {
    request(server)
      .post('/api/website/add')
      .set('Authorization', token)
      .send(testInput.invalidWebsite)
      .expect(400, done);
  });
  it('Status 400 on already existing website', done => {
    request(server)
      .post('/api/website/add')
      .set('Authorization', token)
      .send(testInput.testWebsite)
      .expect(400)
      .end((err, res) => {
        expect(res.body.url).equal('Website already added.');
        done();
      });
  });
  it('Status 401 on unauthorized access', done => {
    request(server)
      .post('/api/website/add')
      .send(testInput.testWebsite)
      .expect(401, done);
  });
});

describe('GET /website/list route with data', done => {
  it('Status 200 with list of added websites', done => {
    request(server)
      .get('/api/website/list')
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.length).equal(1);
        done();
      });
  });

  it('Status 401 on unauthorized access', done => {
    request(server)
      .get('/api/website/list')
      .expect(401, done);
  });
});

after(done => {
  sequelize.close();
  done();
  // Need to manually exit mocha
  process.exit(0);
});
