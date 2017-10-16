const express = require('express');
const app = express();

const Url = require('./models/url');

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get(/^\/new\/(https?:\/\/.+)/, function(req, res) {
  const urlToShorten = req.params[0]

  Url.findOne({url: urlToShorten})
      .then(function(doc) {
        if (doc) return Promise.resolve(doc);

        const url = new Url({
          url: urlToShorten,
          shortened: '' + (Math.random()), // TODO assign proper value
        });
        return url.save();
      })
      .then(function({url, shortened}) {
        return res.send({url, shortened});
      });
});

module.exports = app;
