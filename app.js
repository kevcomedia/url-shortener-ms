const express = require('express');
const randomstring = require('randomstring');

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

        return Url.find({}, {shortened: true})
            .then(function(docs) {
              const shortenedSet = new Set(docs.map((doc) => doc.shortened));

              let shortened = '';
              while (true) {
                shortened = randomstring.generate({length: 7});
                if (!shortenedSet.has(shortened)) break;
              }

              const url = new Url({
                url: urlToShorten,
                shortened,
              });
              return url.save();
            });
      })
      .then(function({url, shortened}) {
        return res.send({url, shortened});
      });
});

module.exports = app;
