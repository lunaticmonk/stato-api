"use strict";

/**
 * Restrict the access according to the user here.
 *
 */

const jwt = require("jsonwebtoken");
const logger = require("../logger");
const config = require("../../config/config");

const userController = require("../controllers/user");

function isAuthenticated(req, res, next) {
	const accessToken = req.headers["x-access-token"];
	const { email, refreshToken } = req;
	jwt.verify(accessToken, config.secret, (err, decoded) => {
		if (err) {
			/**
			 * TODO:// if accessToken is expired, see if refreshToken is valid, if yes, get new access token and return.
			 *
			 */
			if (err.name === "TokenExpiredError") {
				logger.error(`Token expired for user: ${email}`);
				res.status(404).send({
					success: false,
					message: `TokenExpiredError`,
					code: 404
				});
			} else {
				res.status(401).send({
					success: false,
					message: `Unauthorized`,
					code: 401
				});
			}
		} else {
			req.decoded = decoded;
			return next();
		}
	});
}

async function isSelf(req, res, next) {
	const accessToken = req.headers["x-access-token"];
	let { user_id: userId } = req.body;

	/**
	 *
	 * user id is passed as user_id and uuid in some cases. unify all of them. TODO
	 *
	 */

	if (!userId) {
		userId = req.body.uuid;
	}

	try {
		// get user from access token

		const user = await userController.getMe(accessToken);

		// get user from uuid

		const currentUser = await userController.getUserFromUuid(userId);

		// compare both. return next() if equal. else return err.

		if (user.data.get("email") === currentUser.data.get("email")) {
			return next();
		} else {
			throw new Error(`Unauthorized`);
		}
	} catch (err) {
		const error = {
			success: false,
			code: 401,
			message: `Unauthorized`
		};
		res.status(error.code).send(error);
	}
}

module.exports = {
	isAuthenticated,
	isSelf
};
