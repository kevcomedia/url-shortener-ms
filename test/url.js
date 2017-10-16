/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const Url = require('../models/url');
const app = require('../app');

const testDb = 'test_urlShortener';
const testDbUri = `mongodb://localhost/${testDb}`;

chai.should();
chai.use(chaiHttp);

let server;

before(function startServer(done) {
  mongoose.Promise = global.Promise;

  mongoose.connect(testDbUri, {useMongoClient: true});
  mongoose.connection
      .once('open', () => server = app.listen(8888, done))
      .on('error', done);
});

afterEach(function dropTestCollection(done) {
  mongoose.connection.dropDatabase(testDb, done);
});

after(function killServer(done) {
  server.close(function() {
    mongoose.connection.close(done);
  });
});

describe('URL Shortener', () => {
  describe('Parsing URLs', () => {
    it('should accept URLs that start with `http://`', (done) => {
      chai.request(server)
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('url')
                .that.equals('http://example.com');
            done();
          });
    });

    it('should accept URLs that start with `https://`', (done) => {
      chai.request(server)
          .get('/new/https://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('url')
                .that.equals('https://example.com');
            done();
          });
    });

    it('should reject if it doesn\'t start with `http://` or `https://`', (done) => {
      chai.request(server)
          .get('/new/example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(400);
            res.body.should.have.all.own.keys('error');
            done();
          });
    });
  });

  describe('Saving URLs', () => {
    it('should return JSON with `url` and `shortened` keys', (done) => {
      chai.request(server)
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.all.own.keys('url', 'shortened');
            done();
          });
    });

    it('should store the URL and its shortened version in the database', (done) => {
      const urlToShorten = 'http://example.com';
      chai.request(server)
          .get('/new/' + urlToShorten)
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);

            Url.findOne({url: urlToShorten}, (err, doc) => {
              const {url, shortened} = res.body;
              doc.should.have.property('url').that.equals(url);
              doc.should.have.property('shortened').that.equals(shortened);
              done();
            });
          });
    });

    it('should have the original URL in the response', (done) => {
      const url = 'http://example.com';
      chai.request(server)
          .get('/new/' + url)
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('url').that.equals(url);
            done();
          });
    });

    it('should reuse the shortened URL if URL is entered more than once', (done) => {
      chai.request(server)
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);

            const originalResponse = res.body;
            chai.request(server)
                .get('/new/http://example.com')
                .end((err, res) => {
                  if (err) done(err);

                  res.body.should.eql(originalResponse);
                  done();
                });
          });
    });
  });
});
