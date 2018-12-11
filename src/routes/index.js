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

// router.post("/signup", (req, res) => {
//   logger.info(`POST: /signup`);
//   res.status(200).send(`user saved.`);
// });

router.post("/signup", async (req, res) => {
  try {
    console.log(`POST /signup`);
    const result = await userController.saveUser(req.body);
    // console.log(`>>> Result: ${JSON.stringify(result)}`);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error
    });
  }
});

module.exports = router;
