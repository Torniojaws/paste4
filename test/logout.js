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

describe('POST /logout', () => {

  beforeEach((done) => {
    Token.remove({}, (err) => {
      done();
    });
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('returns expected response for a valid logout', (done) => {
    const access = uuid();
    const username = 'test';

    const testToken = new Token({
      access_token: access,
      refresh_token: uuid(),
      username,
    });

    const payload = {
      username,
      access_token: access
    };

    testToken.save()
      .then((savedToken) => {
        chai.request(server)
          .post('/logout')
          .send(payload)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.length).to.not.eql(0);
            expect(res.body).to.have.property('success').eql(true);
            expect(res.body).to.have.property('message').eql('Logged out');
            done();
          });
      });
  });

  it('revokes access token upon successful logout', async () => {
    const access = uuid();
    const username = 'test';

    const testToken = new Token({
      access_token: access,
      refresh_token: uuid(),
      username,
    });

    // Make sure it is deleted
    const getUser = () => {
      return Token.find({ username }).limit(1).exec();
    };

    const payload = {
      username,
      access_token: access
    };

    try {
      const savedToken = await testToken.save();
    } catch (err) {
      console.log('Should not go here');
    }

    chai.request(server)
      .post('/logout')
      .send(payload)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.length).to.not.eql(0);
        expect(res.body).to.have.property('success').eql(true);
        expect(res.body).to.have.property('message').eql('Logged out');

        const results = getUser()
          .then(results => {
            expect(results).to.have.length(0);
          })
          .catch(err => expect(err).to.be.null);
      });
  });

  it('returns 400 Bad Request upon invalid payload', (done) => {
    const payload = { username: '' };
    chai.request(server)
      .post('/logout')
      .send(payload)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('success').eql(false);
        expect(res.body).to.have.property('message').eql('Invalid payload');
      });
    done();
  });

});
