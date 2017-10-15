process.env.NODE_ENV = 'default';

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port);
