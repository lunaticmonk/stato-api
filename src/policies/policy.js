"use strict";

/**
 * Restrict the access according to the user here.
 *
 */

const jwt = require("jsonwebtoken");
const logger = require("../logger");
const config = require("../../config/config");

function isAuthenticated(req, res, next) {
	const accessToken = req.headers["x-access-token"];
	const { email, refreshToken } = req;
	jwt.verify(accessToken, config.secret, (err, decoded) => {
		if (err) {
			// logger.error(err);
			// TODO:// check if the error is `jwt token expired`, get a new access token from /token.
			console.log(err);
			if (err.name === "TokenExpiredError") {
				console.log(`>>> Token expired`);
				res.status(404).send({
					success: false,
					message: `TokenExpiredError`,
					code: 404
				});
			}
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
};
