const express = require('express');
const app = express();

const url = require('./app/routes/url');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get(/^\/new\/(https?:\/\/.+)/, url.saveUrl);

module.exports = app;
