"use strict";

const { Router } = require("express");

const router = new Router();
const logger = require("../logger");

const userController = require("../controllers/user");
const organizationController = require("../controllers/organization");
const { isAuthenticated } = require('../policies/policy');

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
router.post("/admin/organizations/create", isAuthenticated, async (req, res) => {
  try {
    const result = await organizationController.createOrganization(req.body);
    logger.info(result.message);
    res.status(result.code).send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(error.code).send(error);
  }
});

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
router.get("/users/me", async (req, res) => {
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
router.get("/admin/organizations", async (req, res) => {
  try {
    const accessToken = req.headers["x-access-token"];
    const result = await organizationController.getAllOrganizationsPerAdmin(accessToken);
    logger.info(result.message);
    res.status(result.code).send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(error.code).send(error);
  }
});

module.exports = router;
