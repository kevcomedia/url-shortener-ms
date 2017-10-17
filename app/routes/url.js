const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const Url = require('../../models/url');
const {generateUniqueId} = require('../../utils/utils');

/**
 * Creates and saves a Url document to the database.
 *
 * @param {string} urlToShorten The original URL to shorten.
 * @param {object} knownIds A Set of known or used IDs so far.
 * @param {object} req The request object, whose `protocol` and `hostname`
 * properties are used in the shortened URL.
 *
 * @return {object} A Mongoose promise after saving to the database.
 */
function createUrl(urlToShorten, knownIds, {protocol, hostname} = {}) {
  const shortened = generateUniqueId(knownIds);
  const url = new Url({
    original: urlToShorten,
    shortened: `${protocol}://${hostname}/${shortened}`,
  });
  return url.save();
}

/**
 * Responds with a JSON that contains the original URL and its shortened
 * version.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
function saveUrl(req, res) {
  const urlToShorten = req.params[0];

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

/**
 * Responds with an error message for inputs that are not URLs.
 *
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 */
function invalidInput(req, res) {
  res.status(400).send({error: `${req.params.invalid} is not valid`});
}

router.get(/^\/new\/(https?:\/\/.+)/, saveUrl);
router.get('/new/:invalid', invalidInput);

module.exports = router;
