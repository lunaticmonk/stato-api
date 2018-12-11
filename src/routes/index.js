"use strict";

const { Router } = require("express");

const router = new Router();
const logger = require("../logger");

const userController = require("../controllers/user");

/**
 * Make the requests async
 *
 */
router.get("/", (req, res) => {
  console.log(`GET: /`);
  res.status(200).send("mkl");
});

router.post("/signup", async (req, res) => {
  try {
    console.log(`POST /signup`);
    const result = await userController.saveUser(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    console.log(`POST /signin`);
    const accessToken = req.headers["x-access-token"];
    const result = await userController.login(accessToken, req.body);
    logger.info(result.message);
    res.status(result.code).send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(error.code).send(error);
  }
});

module.exports = router;
