const express = require('express');
const app = express();

const urlRoutes = require('./app/routes/url');
const redirectRoutes = require('./app/routes/redirect');

app.use('/', urlRoutes);
app.use('/', redirectRoutes);

app.get('/', function(req, res) {
  res.send('Hello World');
});

module.exports = app;
