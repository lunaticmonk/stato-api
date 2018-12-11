"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../config/config");
const uuid = require("uuid/v1");
const User = require("../models/user");

function saveUser(body) {
  const { email, password, first_name, last_name } = body;
  const hashedPassword = bcrypt.hashSync(password, 8);

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

function login(accessToken, body) {
  return new Promise((resolve, reject) => {
    const { email } = body;

    if (accessToken) {
      jwt.verify(accessToken, config.secret, (err, decoded) => {
        if (err) {
          reject({
            success: false,
            message: "Invalid access token.",
            code: 400
          });
        } else {
          if (decoded.email === email) {
            resolve({
              success: true,
              message: `User with email: ${decoded.email} logged in.`,
              code: 200
            });
          } else {
            reject({
              success: false,
              message: "Token is not valid. Unauthorized",
              code: 401
            });
          }
        }
      });
    }
  });
}

module.exports = {
  saveUser,
  login
};
