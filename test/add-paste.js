process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Paste = require('../apps/pastes/model');
let server = require('../index');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
let expect = chai.expect;

/**
 * Add a valid paste
 */
describe('POST /pastes', () => {
  // Make sure we have an empty dataset in the test DB
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should add a new paste', (done) => {
    const paste = {
      message: "We are live",
      tags: ["Testing", "Posting"]
    };
    chai.request(server)
      .post('/pastes')
      .send(paste)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('result').eql('New paste added');
        done();
      });
  });

  it('should reject a paste without a message', (done) => {
    const paste = {
      tags: ["Testing", "Posting"]
    };
    chai.request(server)
      .post('/pastes')
      .send(paste)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('result').eql('Missing \'message\' from payload');
        done();
      });
  });
});
