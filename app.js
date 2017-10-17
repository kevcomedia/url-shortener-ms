const express = require('express');
const app = express();

const url = require('./app/routes/url');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get(/^\/new\/(https?:\/\/.+)/, url.saveUrl);

app.get('/new/:invalid', function(req, res) {
  return res.status(400).send({error: `${req.params.invalid} is not valid`});
});

module.exports = app;
