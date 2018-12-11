"use strict";

// module imports.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require('./logger');
const routes = require("./routes");

// direct imports
require("dotenv").config();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});
