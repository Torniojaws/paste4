process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Paste = require('../apps/pastes/model');
let server = require('../index');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
let expect = chai.expect;

describe('PUT /pastes/:id', () => {
  // Make sure we have an empty dataset in the test DB
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should update a valid paste', (done) => {
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      .then((paste) => {
        const updated = {
          message: "It works",
          tags: ["Testing", "Updating"]
        };
        chai.request(server)
          .put('/pastes/' + paste._id)
          .send(updated)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('result').eql('Paste updated');
            done();
          });
      })
      .catch((err) => {
        console.error("Something went very wrong");
      })
  });

  it('should reject an edit without a message', (done) => {
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      .then((paste) => {
        const updated = {
          tags: ["Testing", "Posting"]
        };
        chai.request(server)
          .put('/pastes/' + paste._id)
          .send(updated)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('result').eql('Missing \'message\' from payload');
            done();
          });
      })
      .catch((err) => {
        console.error("Something went very wrong");
      })
  });

  it('should return 404 for an invalid paste ID', (done) => {
    const pasteItem = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    pasteItem.save()
      .then((paste) => {
        const updated = {
          message: "Testing",
          tags: ["Testing", "Posting"]
        };
        chai.request(server)
          .put('/pastes/doesnotexist')
          .send(updated)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('result').eql('Paste not found');
            done();
          });
      })
      .catch((err) => {
        console.error("Something went very wrong");
      })
  });
});
