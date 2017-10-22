const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const Url = require('../../models/url');

router.get(/^\/([A-Za-z0-9]{7})$/i, function(req, res) {
  Url.findOne({shortened: {$regex: req.params[0]}})
      .then((doc) => {
        res.redirect(doc.original);
      })
      .catch((err) => {
        res.status(404).send({error: `${req.params[0]} not found`});
      });
});

router.use('*', function(req, res) {
  res.sendStatus(400);
});

module.exports = router;
