const randomstring = require('randomstring');
const Url = require('../../models/url');

function saveUrl(req, res) {
  const urlToShorten = req.params[0]

  Url.findOne({original: urlToShorten})
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
                original: urlToShorten,
                shortened: `${req.protocol}://${req.hostname}/${shortened}`,
              });
              return url.save();
            });
      })
      .then(function({original, shortened}) {
        return res.send({original, shortened});
      });
}

module.exports = {saveUrl};
