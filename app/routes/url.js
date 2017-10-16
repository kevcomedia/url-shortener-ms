const Url = require('../../models/url');
const {generateUniqueId} = require('../../utils/utils');

function createUrl(urlToShorten, knownIds, {protocol, hostname} = {}) {
  const shortened = generateUniqueId(knownIds);
  const url = new Url({
    original: urlToShorten,
    shortened: `${protocol}://${hostname}/${shortened}`,
  });
  return url.save();
}

function saveUrl(req, res) {
  const urlToShorten = req.params[0]

  Url.findOne({original: urlToShorten})
      .then(function(doc) {
        if (doc) return Promise.resolve(doc);

        return Url.find({}, {shortened: true})
            .then(function(docs) {
              const shortenedSet = new Set(docs.map((doc) => doc.shortened));
              return createUrl(urlToShorten, shortenedSet, req);
            });
      })
      .then(function({original, shortened}) {
        return res.send({original, shortened});
      });
}

module.exports = {saveUrl};
