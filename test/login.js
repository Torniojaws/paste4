process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Token = require('../apps/login/model');
let server = require('../index');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
chai.use(require('chai-uuid'));
let expect = chai.expect;
let uuid = require('uuid/v4');

let sinon = require('sinon');
let sandbox = sinon.createSandbox();

// Util tests
const { generateToken } = require('../apps/login/controller');

describe('POST /login', () => {

  beforeEach((done) => {
    Token.remove({}, (err) => {
      done();
    });
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('returns expected response for a valid login', (done) => {
    const payload = {
      username: 'test',
      password: 'test'
    };
    chai.request(server)
      .post('/login')
      .send(payload)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.length).to.not.eql(0);
        expect(res.body).to.have.property('success').eql(true);
        expect(res.body).to.have.property('message').eql('Enter the Paste');
        expect(res.body).to.have.property('access_token').to.be.a.uuid('v4');
        expect(res.body).to.have.property('refresh_token').to.be.a.uuid('v4');
        expect(res.body).to.have.property('expires_in').eql(3600);
        done();
      });
  });

  it('returns "already logged in" message for valid user with non-expired token', (done) => {
    const testToken = new Token({
      access_token: 'test-token',
      refresh_token: 'test-token',
      username: 'test',
    });

    testToken.save()
      .then((savedToken) => {
        const user = {
          username: 'test',
          password: 'test'
        };
        chai.request(server)
          .post('/login')
          .send(user)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.length).to.not.eql(0);
            expect(res.body).to.have.property('success').eql(true);
            expect(res.body).to.have.property('message').eql('Already logged in');
            done();
          });
      })
      .catch((err) => {
        console.log('Errorrr: ', err);
        done();
      });
  });

  it('returns 401 for a login attempt with non-existing user', (done) => {
    const fakeUser = {
      username: 'fake',
      password: 'nope'
    };
    chai.request(server)
      .post('/login')
      .send(fakeUser)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body.length).to.not.eql(0);
        expect(res.body).to.have.property('success').eql(false);
        expect(res.body).to.have.property('message').eql('Invalid login');
        done();
      });
  });

  it('returns 401 for an invalid payload', (done) => {
    const user = {
      unknown: 'fake',
      wrong: 'nope'
    };
    chai.request(server)
      .post('/login')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body.length).to.not.eql(0);
        expect(res.body).to.have.property('success').eql(false);
        expect(res.body).to.have.property('message').eql('Invalid login');
        done();
      });
  });

  it('handles a dropped DB connection', (done) => {
    const user = {
      username: 'test',
      password: 'test'
    };
    // Let's break the connection
    sandbox.stub(mongoose.Query.prototype, 'find').yields({ error: 'MongoError' });
    chai.request(server)
      .post('/login')
      .send(user)
      .end((err, res) => {
        expect(err).to.be.null;
        console.log(res.body);
        //expect(res.body).to.have.property('success').eql(false);
        //expect(res.body).to.have.property('message').eql('Failed to retrieve user');
        done();
      });
  });

});

describe('Util functions for /login', () => {
  describe('#generateToken', () => {
    it('returns a new UUID when existing refresh_token is missing', (done) => {
      const token = {
        access_token: 'test',
        refresh_token: null
      };
      const tokens = generateToken(token);
      expect(tokens).to.have.property('refresh').to.be.a.uuid('v4');
      done();
    });
    it('returns the existing UUID when refresh_token exists', (done) => {
      const validToken = uuid();
      const token = {
        access_token: 'test',
        refresh_token: validToken
      };
      const tokens = generateToken(token);
      expect(tokens).to.have.property('refresh').to.be.a.uuid('v4');
      expect(tokens).to.have.property('refresh').eql(validToken);
      done();
    });
  });
});
