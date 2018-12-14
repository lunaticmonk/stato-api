"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/config");
const uuid = require("uuid/v1");
const User = require("../models/user");
const logger = require("../logger");
const tokenList = {};

function saveUser(body) {
	const { email, password, first_name, last_name } = body;
	const hashedPassword = bcrypt.hashSync(password, 8);

	return User.where({
		email
	})
		.fetch()
		.then(model => {
			if (model) {
				logger.warn(`User with email address: ${email} alredy exists`);
				return {
					success: false,
					message: `User with email address ${email} already exists`,
					code: 200
				};
			} else {
				return User.forge({
					uuid: uuid(),
					email,
					first_name,
					last_name,
					password: hashedPassword
				})
					.save()
					.then(model => {
						const response = {
							success: true,
							message: "Authentication successful!",
							code: 200
						};
						return response;
					})
					.catch(error => {
						logger.warn(`Authentication failed for email: ${email} ${error}`);
						return {
							success: false,
							message: `Request failed. Please try again`,
							code: 500
						};
					});
			}
		})
		.catch(error => {
			return {
				success: false,
				message: `Fetching user failed.`,
				code: 500
			};
		});
}

function login(body) {
	return new Promise((resolve, reject) => {
		const { email, password } = body;
		console.log(`Logging in: ${email} ${password}`);
		return User.where({ email })
			.fetch()
			.then(model => {
				bcrypt.compare(
					password,
					model.get("password"),
					(err, passwordCorrect) => {
						if (passwordCorrect) {
							const accessToken = jwt.sign({ email }, config.secret, {
								expiresIn: "24h"
							});
							const refreshToken = jwt.sign({ email }, config.secret, {
								expiresIn: "1w"
							});
							const response = {
								email,
								refreshToken: refreshToken,
								accessToken: accessToken
							};
							tokenList[refreshToken] = response;
							resolve({
								success: true,
								message: `User with email: ${email} logged in.`,
								data: response,
								code: 200
							});
						} else {
							reject({
								success: false,
								message: `Incorrect password`,
								code: 200
							});
						}
					}
				);
			})
			.catch(err => {
				return {
					success: false,
					message: `User not registered`,
					code: 400
				};
			});
	});
}

function getNewAccessToken(body) {
	const { email, refreshToken } = body;
	// if refresh token exists
	if (refreshToken && refreshToken in tokenList) {
		const token = jwt.sign({ email }, config.secret, {
			expiresIn: "24h"
		});
		const response = {
			success: true,
			message: `New access token generatedd for user: ${email}`,
			token: token,
			code: 200
		};
		// update the token in the list
		tokenList[refreshToken].token = token;
		return response;
	} else {
		return {
			success: false,
			message: `Invalid request`,
			code: 404
		};
	}
}

module.exports = {
	saveUser,
	login,
	getNewAccessToken
};
