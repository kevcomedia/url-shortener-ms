const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;
const mongodbUri = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;

mongoose.connect(mongodbUri, {useMongoClient: true});
mongoose.connection
    .once('open', () => app.listen(port))
    .on('error', console.error); // eslint-disable-line no-console
