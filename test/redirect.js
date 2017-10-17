/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');

const Url = require('../models/url');
const server = require('./index');

chai.should();
chai.use(chaiHttp);

describe('URL Redirect', function() {
  this.timeout(15000);

  beforeEach(function storeUrl(done) {
    chai.request(server())
        .get('/new/http://www.example.com')
        .end(done);
  });

  it('should redirect to the original URL', (done) => {
    chai.request(server())
        .get('/new/http://www.example.com')
        .then(() => {
          return Url.findOne({original: 'http://www.example.com'});
        })
        .then((doc) => {
          // The database doesn't store the port number, so the request URL
          // needs to be reconstructed to include it.
          return chai.request('localhost:8888')
              .get('/' + doc.shortened.substr(-7));
        })
        .then((res) => {
          res.should.redirect;
          res.should.redirectTo('http://www.example.com/');
          done();
        })
        .catch(done);
  });

  // eslint-disable-next-line max-len
  it('should respond with an error message if shortened URL is not found', (done) => {
    Url.remove({})
        .then(() => {
          return chai.request('localhost:8888').get('/abcdefg');
        })
        .catch((err) => {
          err.should.be.not.null;
          err.should.have.status(404);
          err.response.body.should.have.property('error');
          done();
        });
  });
});
