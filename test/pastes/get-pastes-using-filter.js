process.env.NODE_ENV = 'test';

let Paste = require('../../apps/pastes/model');
let server = require('../../index');
let pastes = require('../../apps/pastes/controller');

let chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-date-string'));
let expect = chai.expect;
let sinon = require('sinon');

describe('GET /pastes?marked=all', () => {
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should return an empty result when no data exists', (done) => {
    chai.request(server)
      .get('/pastes?marked=all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(0);
        done();
      });
  });

  it('should return all results when data exists', (done) => {
    const paste1 = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    const paste2 = new Paste({ message: 'Test 2', tags: ['unit', 'test'] });
    const paste3 = new Paste({ message: 'Marked', tags: ['unit', 'test'], marked: true });
    paste1.save();
    paste2.save();
    paste3.save();

    chai.request(server)
      .get('/pastes?marked=all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(3);
        done();
      });
  });

});

describe('GET /pastes?marked=true', () => {
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should return an empty result when no data exists', (done) => {
    chai.request(server)
      .get('/pastes?marked=true')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(0);
        done();
      });
  });

  it('should return only marked Pastes when mixed data exists', (done) => {
    const paste1 = new Paste({ message: 'Test 1', tags: ['unit', 'test'] });
    const paste2 = new Paste({ message: 'Test 2', tags: ['unit', 'test'] });
    const paste3 = new Paste({ message: 'Marked', tags: ['unit', 'test'], marked: true });
    paste1.save();
    paste2.save();
    paste3.save();

    chai.request(server)
      .get('/pastes?marked=true')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(1);
        expect(res.body[0].message).to.eql('Marked');
        done();
      });
  });
});

describe('GET /pastes?marked=false', () => {
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should return an empty result when no data exists', (done) => {
    chai.request(server)
      .get('/pastes?marked=false')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(0);
        done();
      });
  });

  it('should return only unmarked results', (done) => {
    const paste1 = new Paste({ message: 'Test 1', tags: ['unit', 'test'], marked: true });
    const paste2 = new Paste({ message: 'Unmarked', tags: ['unit', 'test'], marked: false });
    const paste3 = new Paste({ message: 'Test 2', tags: ['unit', 'test'], marked: true });
    paste1.save();
    paste2.save();
    paste3.save();

    chai.request(server)
      .get('/pastes?marked=false')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(1);
        expect(res.body[0].message).to.eql('Unmarked');
        done();
      });
  });
});

describe('GET /pastes?marked=invalid', () => {
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should return a 400 Bad Request, even if no data exists', (done) => {
    chai.request(server)
      .get('/pastes?marked=invalid')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.length).to.eql(0);
        done();
      });
  });

  it('should return 400 Bad Request, even when data exists', (done) => {
    const paste1 = new Paste({ message: 'Test 1', tags: ['unit', 'test'], marked: false });
    const paste2 = new Paste({ message: 'Test 2', tags: ['unit', 'test'], marked: false });
    paste1.save();
    paste2.save();

    chai.request(server)
      .get('/pastes?marked=invalid')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.length).to.eql(0);
        done();
      });
  });
});

describe('GET /pastes?tag=value', () => {
  beforeEach((done) => {
    Paste.remove({}, (err) => {
      done();
    });
  });

  it('should return all pastes that match the tag', (done) => {
    const paste1 = new Paste({
      message: 'Test 1', tags: ['unit', 'test'], marked: false, createdAt: new Date("2018-01-01 10:00:00") });
    const paste2 = new Paste({
      message: 'Test 2', tags: ['unit', 'stuff'], marked: false, createdAt: new Date("2018-02-02 10:00:00") });
    const paste3 = new Paste({
      message: 'Test 3', tags: ['more', 'stuff'], marked: true, createdAt: new Date("2018-03-03 10:00:00") });
    paste1.save();
    paste2.save();
    paste3.save();

    chai.request(server)
      .get('/pastes?tag=stuff')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.length).to.eql(2);
        // They are returned in descending order by created date
        expect(res.body[0]).to.have.property('message').eql('Test 3');
        expect(res.body[1]).to.have.property('message').eql('Test 2');
        done();
      });
  });

  it('should return an empty array for tag with no matches', (done) => {
    done();
  });
});
