'use strict';

const express = require('express');
const app = express();
const logger = require('./logger');

require('dotenv').config()
const PORT = process.env.PORT || 8083;
// const dotenv = require('dotenv');


/**
 * Routes
 * TODO: use the policy middleware before every route.
 */

app.get('/', (req, res) => {
  res.status(200).send('mkl');
});

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});