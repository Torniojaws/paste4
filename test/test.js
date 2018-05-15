process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

/**
 * Test the root endpoint.
 *
 * Note to self:
 * If the content-type is text/plain, the data is in res.text
 * Otherwise it is in res.body
 */
describe('GET index', () => {
  it('should get the welcome message', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.eql('Hello there');
        done();
      });
  });
});
