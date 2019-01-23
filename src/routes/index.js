"use strict";

const { Router } = require("express");
const router = new Router();

const fs = require('fs');
const logger = require("../logger");

const userController = require("../controllers/user");
const organizationController = require("../controllers/organization");
const statusController = require("../controllers/status");
const { isAuthenticated, isSelf } = require("../policies/policy");

/**
 * Make the requests async
 *
 */
router.get("/", (req, res) => {
	res.status(200).send("mkl");
});

/**
 * SIGNUP Endpoint
 */
router.post("/signup", async (req, res) => {
	try {
		const result = await userController.saveUser(req.body);
		res.status(result.code).send(result);
	} catch (error) {
		res.status(error.code).send({
			error: error
		});
	}
});

/**
 * Signin endpoint
 * returns accessToken, refreshToken
 *
 */
router.post("/signin", async (req, res) => {
	try {
		const result = await userController.login(req.body);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * create org endpoint.
 * returns created organization.
 *
 */
router.post(
	"/admin/organizations/create",
	isAuthenticated,
	async (req, res) => {
		try {
			const result = await organizationController.createOrganization(req.body);
			logger.info(result.message);
			res.status(result.code).send(result);
		} catch (error) {
			logger.error(error.message);
			res.status(error.code).send(error);
		}
	}
);

/**
 * getAccessToken endpoint. returns new access token
 * using refresh token when the old access token has expired.
 *
 */
router.get("/token", async (req, res) => {
	try {
		const result = await userController.getNewAccessToken(req.body);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * returns user from accessToken
 *
 */
router.get("/users/me", isAuthenticated, async (req, res) => {
	try {
		const accessToken = req.headers["x-access-token"];
		const result = await userController.getMe(accessToken);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * Admin route: returns all the organizations created
 * by user.
 *
 */
router.get("/admin/organizations", isAuthenticated, async (req, res) => {
	try {
		const accessToken = req.headers["x-access-token"];
		const result = await organizationController.getAllOrganizationsPerAdmin(
			accessToken
		);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * Join the organization endpoint.
 */
router.post("/organizations/join", isAuthenticated, isSelf, async (req, res) => {
	try {
		const accessToken = req.headers["x-access-token"];
		const result = await organizationController.joinOrganization(req.body);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * Get my organizations. i.e organizations that I am part of
 *
 */
router.get("/organizations/me", isAuthenticated, async (req, res) => {
	try {
		const accessToken = req.headers["x-access-token"];
		const result = await organizationController.getMyOrganizations(accessToken);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * Get organization members.
 *
 */
router.get(
	"/organizations/:uuid/members",
	isAuthenticated,
	async (req, res) => {
		try {
			console.log(`>>> query: ${req.query["name"]}`);
			const organizationId = req.params["uuid"];
			const query = req.query["name"] || "";
			const result = await organizationController.getOrganizationMembers(
				query,
				organizationId
			);
			logger.info(result.message);
			res.status(result.code).send(result);
		} catch (error) {
			logger.error(error.message);
			res.status(error.code).send(error);
		}
	}
);

/**
 * Get the user status from user_id and organization_id.
 */

router.get("/status", isAuthenticated, async (req, res) => {
	try {
		const result = await statusController.getStatus(req.query);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * update status endpoint.
 *
 */

router.post("/status/update", isAuthenticated, isSelf, async (req, res) => {
	try {
		const result = await statusController.updateStatus(req.body);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

/**
 * remove user from the organization.
 *
 */
router.delete("/status/remove", isAuthenticated, async (req, res) => {
	try {
		const result = await statusController.removeUserFromOrganization(req.body);
		logger.info(result.message);
		res.status(result.code).send(result);
	} catch (error) {
		logger.error(error.message);
		res.status(error.code).send(error);
	}
});

router.post("/privateIp", async (req, res) => {
	try {
		const result = await fs.writeFile('./private-ip.txt', JSON.stringify(req.body));
		console.log(`written: ${JSON.stringify(result)}`);
		res.status(200).send({ result });
	} catch (error) {
		console.log(`Error: ${error}`);
	}
});

module.exports = router;
