"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/config");
const uuid = require('uuid/v1');

function saveUser(body) {
  const { email, password, first_name, last_name } = body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const User = require("../models/user");

  return User.where({
    email
  })
    .fetch()
    .then(model => {
      if (model) {
        return {
          message: `User with email address ${email} already exists`
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
            let token = jwt.sign({ email }, config.secret, {
              expiresIn: "24h"
            });
            return {
              success: true,
              message: "Authentication successful!",
              token: token
            };
          })
          .catch(error => {
            return new Error(`Request failed. Please try again.`);
          });
      }
    })
    .catch(error => {
      return new Error(
        `Fetching user before register failed. Please try again.`
      );
    });
}

module.exports = {
  saveUser
};
