process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should;
let expect = chai.expect;

chai.use(chaiHttp);

/**
 * Test the root endpoint.
 *
 * Note to self:
 * If the content-type is text/plain, the data is in res.text
 * Otherwise it is in res.body
 */
describe('GET /', () => {
  it('should get the welcome message', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.key('message');
        expect(res.body.message).to.eql('Hello there');
        done();
      });
  });
});
