"use strict";



// module imports.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger");
const morgan = require("morgan");
const routes = require("./routes");
const morganConfig = require('./morgan');
const cors = require('cors');

require("dotenv").config();

/**
 * Allow unsecure origins for local development.
 */

const whitelist = process.env.ALLOWED_DOMAINS.split(',');
console.log(whitelist);
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};


// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(morganConfig));
app.use(cors(corsOptions));
app.use(routes);

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  logger.info(`Listening on port: ${PORT}`);
});
