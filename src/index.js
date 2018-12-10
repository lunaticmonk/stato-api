'use strict';

// module imports.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./logger');
const routes = require('./routes');

// direct imports
require('dotenv').config();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// vars requiring envs
const PORT = process.env.PORT || 8083;



/**
 * Routes
 * TODO: use the policy middleware before every route.
 */

// app.get('/', (req, res) => {
//   res.status(200).send('mkl');
// });

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});