"use strict";

const uuid = require("uuid/v1");
const logger = require("../logger");
const Organization = require("../models/organization");

function createOrganization(body) {
  const { name, email, url } = body;
  return Organization.forge({
    uuid: uuid(),
    name,
    url,
    email
  })
    .save()
    .then(model => {
      return {
        success: true,
        data: {
          uuid: model.get('uuid'),
          name: model.get('name'),
          url: model.get('url')
        },
        message: `Organization created`,
        code: 200
      }
    })
    .catch(err => {
      logger.error(err);
      return {
        success: false,
        message: `Unknown error.`,
        code: 500
      }
    });
}

module.exports = {
  createOrganization
};
