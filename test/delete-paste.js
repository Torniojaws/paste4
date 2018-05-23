process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Paste = require('../apps/pastes/model');
let server = require('../index');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
let expect = chai.expect;
let sinon = require('sinon');
let sandbox = sinon.createSandbox();
let pastes = require('../apps/pastes/controller');
let httpMocks = require('node-mocks-http');

describe('DELETE /pastes/:id', () => {

  // Make sure we have an empty dataset in the test DB
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('should delete a valid paste', (done) => {
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      .then((paste) => {
        chai.request(server)
          .delete('/pastes/' + paste._id)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            // expect(res.body).to.have.property('result').eql('Paste marked');
            done();
          });
      })
      .catch((err) => {
        console.error("Something went very wrong");
        done();
      });
  });

  it('should return 404 for a non-existing paste', (done) => {
    chai.request(server)
      .delete('/pastes/doesnotexist')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('result').eql('Paste not found');
        done();
      });
  });

  it('should handle an error during the save in the endpoint', (done) => {
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      .then((paste) => {
        sandbox.stub(mongoose.Model.prototype, 'save').yields({ error: 'MongoError' });
        chai.request(server)
          .delete('/pastes/' + paste._id)
          .end((err, res) => {
            expect(res).to.have.status(400);
            done();
          });
      })
      .catch((err) => {
        console.log('Should not go here');
      });
  });

});
