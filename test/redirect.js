/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');

const Url = require('../models/url');
const server = require('./index');

chai.should();
chai.use(chaiHttp);

describe('URL Redirect', () => {
  beforeEach(function storeUrl(done) {
    chai.request(server())
        .get('/new/http://example.com')
        .end(done);
  });

  it('should redirect to the original URL', (done) => {
    Url.findOne({original: 'http://example.com'})
        .then((doc) => {
          return chai.request(server())
              .get(doc.shortened)
        })
        .then((res) => {
          res.should.redirect;
          res.should.redirectTo('http://example.com');
          done();
        });
  });
});
