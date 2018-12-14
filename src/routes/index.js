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

router.post("/organizations/create", isAuthenticated, async (req, res) => {
  try {
    const result = await organizationController.createOrganization(req.body);
    logger.info(result.message);
    res.status(result.code).send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(error.code).send(error);
  }
});

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

module.exports = router;
