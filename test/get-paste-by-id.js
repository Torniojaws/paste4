process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Paste = require('../apps/pastes/model');
let server = require('../index');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
let expect = chai.expect;

/**
 * With no values in the DB, we expect an empty result
 */
describe('GET /pastes/:id', () => {
  // Make sure we have an empty dataset in the test DB
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should return 404 when ID does not exist', (done) => {
    chai.request(server)
      .get('/pastes/doesnotexist')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should return the paste when data exists', (done) => {
    let pasteId = 0;
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      // The save() in mongoose is an asynchronous operation, so wait for it to finish
      .then((paste) => {
        chai.request(server)
          .get('/pastes/' + paste._id)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.eql('Test 1');
            expect(res.body.tags.length).to.eql(2);
            expect(res.body.createdAt).to.be.a.dateString();
            done();
          });
      })
      .catch((err) => {
        console.error("Something went very wrong");
      });
  });
});
