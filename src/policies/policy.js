'use strict';

/**
 * Restrict the access according to the user here.
 *
 */

 const jwt = require('jsonwebtoken');
const logger = require("../logger");
const config = require('../../config/config');

function isAuthenticated(req, res, next) {
  const accessToken = req.headers['x-access-token'];
  jwt.verify(accessToken, config.secret, (err, decoded) => {
    if (err) {
      logger.error(err);
      // TODO:// check if the error is `jwt token expired`, get a new access token from /token.
      res.status(401).send({
        success: false,
        message: `Unauthorized`,
        code: 401
      });
    } else {
      req.decoded = decoded;
      return next();
    }
  });
}

module.exports = {
  isAuthenticated
}