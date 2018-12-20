/**
 * Organization controller.
 * Contains all the business logic executed after
 * hitting any organization endpoint in routes.
 *
 */

"use strict";

const uuid = require('uuid/v1');
const logger = require("../logger");
const Organization = require("../models/organization");
const userController = require("./user");

function createOrganization(body) {
  const { name, email, url, admin } = body;
	return Organization.forge({
		uuid: uuid(),
		name,
		url,
		admin,
		invite_key: uuid()
	})
		.save()
		.then(model => {
			return {
				success: true,
				data: {
					uuid: model.get("uuid"),
					name: model.get("name"),
					url: model.get("url"),
          admin: model.get("admin"),
          invite_key: model.get("invite_key")
				},
				message: `Organization created`,
				code: 200
			};
		})
		.catch(err => {
      // logger.error(err);
      console.log(err);
			return {
				success: false,
				message: `Unknown error.`,
				code: 500
			};
		});
}

async function getAllOrganizationsPerAdmin(accessToken) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await userController.getMe(accessToken);
			const admin = user.data.get("uuid");
			const organizationsPerAdmin = await Organization.where({
				admin
			}).fetchAll();
			if (organizationsPerAdmin.length === 0) {
				resolve({
					success: true,
					message: `No organizations where current user is an admin`,
					code: 200
				});
			}
			resolve({
				success: true,
				message: `returned organizations`,
				data: organizationsPerAdmin,
				code: 200
			});
		} catch (error) {
			reject({
				success: false,
				message: `Error in fetching organizations`,
				code: 404
			});
		}
	});
}

module.exports = {
	createOrganization,
	getAllOrganizationsPerAdmin
};
