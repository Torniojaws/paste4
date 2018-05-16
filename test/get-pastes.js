process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let expect = chai.expect;

chai.use(chaiHttp);

/**
 * We should return all pastes in the MongoDB
 */
describe('GET /pastes', () => {
  it('should return all pastes in the DB', (done) => {
    chai.request(server)
      .get('/pastes')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.length).to.not.equal(0);
        done();
      });
  });
});
