const express = require('express');
const app = express();

const urlRoutes = require('./app/routes/url');

app.use('/', urlRoutes);

app.get('/', function(req, res) {
  res.send('Hello World');
});

module.exports = app;
