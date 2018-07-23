process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Paste = require('../apps/pastes/model');
let server = require('../index');
let pastes = require('../apps/pastes/controller');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
let expect = chai.expect;
let sinon = require('sinon');
let sandbox = sinon.createSandbox();

describe('GET /pastes', () => {
  // Make sure we have an empty dataset in the test DB
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  after((done) => {
    sandbox.restore();
    done();
  });

  it('should return an empty result when no data exists', (done) => {
    chai.request(server)
      .get('/pastes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(0);
        done();
      });
  });

  it('should return results when data exists', (done) => {
    // Add two entries to Pastes
    const paste1 = new Paste({ message: "Test 1", tags: ["unit", "test"] });
    const paste2 = new Paste({ message: "Test 2", tags: ["unit", "test"] });
    paste1.save();
    paste2.save();

    chai.request(server)
      .get('/pastes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(2);
        expect(res.body[0].createdAt).to.be.a.dateString();
        done();
      });
  });

  it('should handle an error in mongoose', (done) => {
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      .then((paste) => {
        sandbox.stub(mongoose.Query.prototype, 'exec').yields({ error: 'MongoError' });
        chai.request(server)
          .get('/pastes')
          .end((err, res) => {
            expect(res).to.have.status(500);
            done();
          });
      })
      .catch((err) => {
        console.log('Should not go here', err);
      });
  });

});
