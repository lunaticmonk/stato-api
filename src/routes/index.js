"use strict";

const { Router } = require("express");
const User = require("../models/user");

const router = new Router();
const logger = require("../logger");

/**
 * Make the requests async
 *
 */
router.get("/", (req, res) => {
  console.log(`GET: /`);
  res.status(200).send("mkl");
});

router.post("/signup", (req, res) => {
  logger.info(`POST: /signup`);
  res.status(200).send(`user saved.`);
});

module.exports = router;
