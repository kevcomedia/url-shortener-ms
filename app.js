const express = require('express');
const app = express();

const urlRoutes = require('./app/routes/url');
const redirectRoutes = require('./app/routes/redirect');

app.use(express.static('public'));

app.use('/new', urlRoutes);
app.use('/', redirectRoutes);

module.exports = app;
