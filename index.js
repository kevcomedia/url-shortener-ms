process.env.NODE_ENV = 'default';

const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/urlShortener', {useMongoClient: true});
mongoose.connection
    .once('open', () => app.listen(port))
    .on('error', console.error); // eslint-disable-line no-console
