/* eslint-env mocha */

const mongoose = require('mongoose');
const app = require('../app');

mongoose.Promise = global.Promise;

const testDb = 'test_urlShortener';
const testDbUri = `mongodb://localhost/${testDb}`;

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

module.exports = function() {
  return server;
};
