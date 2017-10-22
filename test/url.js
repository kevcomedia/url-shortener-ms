/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');

const Url = require('../models/url');
const server = require('./index');

chai.should();
chai.use(chaiHttp);

describe('URL Shortener', () => {
  describe('Parsing URLs', () => {
    it('should accept URLs that start with `http://`', (done) => {
      chai.request(server())
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('original')
                .that.equals('http://example.com');
            done();
          });
    });

    it('should accept URLs that start with `https://`', (done) => {
      chai.request(server())
          .get('/new/https://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('original')
                .that.equals('https://example.com');
            done();
          });
    });

    it('should reject if it doesn\'t start with `http://` or `https://`', (done) => {
      chai.request(server())
          .get('/new/example.com')
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.all.own.keys('error');
            done();
          });
    });
  });

  describe('Saving URLs', () => {
    it('should return JSON with `original` and `shortened` keys', (done) => {
      chai.request(server())
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.all.own.keys('original', 'shortened');
            done();
          });
    });

    // eslint-disable-next-line max-len
    it('should store the URL and its shortened version in the database', (done) => {
      const urlToShorten = 'http://example.com';
      chai.request(server())
          .get('/new/' + urlToShorten)
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);

            Url.findOne({original: urlToShorten}, (err, doc) => {
              const {original, shortened} = res.body;
              doc.should.have.property('original').that.equals(original);
              doc.should.have.property('shortened').that.equals(shortened);
              done();
            });
          });
    });

    it('should have the original URL in the response', (done) => {
      const url = 'http://example.com';
      chai.request(server())
          .get('/new/' + url)
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('original').that.equals(url);
            done();
          });
    });

    // eslint-disable-next-line max-len
    it('should reuse the shortened URL if URL is entered more than once', (done) => {
      chai.request(server())
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);

            const originalResponse = res.body;
            chai.request(server())
                .get('/new/http://example.com')
                .end((err, res) => {
                  if (err) done(err);

                  res.body.should.eql(originalResponse);
                  done();
                });
          });
    });

    it('should display a full URL in the shortened field', (done) => {
      chai.request(server())
          .get('/new/http://example.com')
          .end((err, res) => {
            if (err) done(err);

            res.should.have.status(200);
            res.body.should.have.property('shortened')
                .that.matches(/^https?:\/\/.+?\/[A-Za-z0-9]{7}/);
            done();
          });
    });
  });
});
