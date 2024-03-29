/**
 * Organization controller.
 * Contains all the business logic executed after
 * hitting any organization endpoint in routes.
 *
 */

"use strict";

const uuid = require("uuid/v1");
const logger = require("../logger");
const Organization = require("../models/organization");
const User = require("../models/user");
const Status = require("../models/status");
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
		.then(async model => {
			console.log(`>>> joining organization`);
			await joinOrganization({
				uuid: admin,
				invite_key: model.get("invite_key")
			});
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
			logger.error(err);
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

async function joinOrganization(body) {
	return new Promise(async (resolve, reject) => {
		const { uuid: userId, invite_key } = body;
		try {
			const organization = await Organization.where({ invite_key }).fetch();
			const organizationId = organization.get("uuid");
			const user = await Status.where({
				user_id: userId,
				organization_id: organizationId
			}).fetch();
			if (!user) {
				/**
				 * user not the member. insert.
				 * TODO:// run a migration setting default status to "online".
				 * Currently it is hardcoded below.
				 */
				const status = await Status.forge({
					uuid: uuid(),
					user_id: userId,
					organization_id: organizationId,
					status: "online"
				}).save();
				logger.info(
					`>>> ${status.get("user_id")} joined ${status.get("organization_id")}`
				);

				const response = {
					organization_id: organizationId
				};

				resolve({
					success: true,
					data: response,
					message: `Joined the organization: ${organization.get(
						"name"
					)} successful`,
					code: 200
				});
			}
			/**
			 * user already member of the org. throw error
			 */
			reject({
				success: false,
				message: `Failed. User already part of the organization.`,
				code: 200
			});
		} catch (err) {
			reject({
				success: false,
				message: `Joining organization failed`,
				code: 200
			});
		}
	});
}

function getMyOrganizations(accessToken) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await userController.getMe(accessToken);
			const userId = user.data.get("uuid");

			let userOrganizationRelations = await Status.where({
				user_id: userId
			}).fetchAll();
			userOrganizationRelations = userOrganizationRelations.toJSON();

			let organizationInfo = [];
			for (const relation of userOrganizationRelations) {
				let userOrganization = await Organization.where({
					uuid: relation.organization_id
				}).fetch();
				organizationInfo.push(userOrganization);
			}
			resolve({
				success: true,
				data: organizationInfo,
				message: `Returned user organizations`,
				code: 200
			});
		} catch (err) {
			logger.error(err);
			reject({
				success: false,
				message: `Failed to return user organizations.`,
				code: 200
			});
		}
	});
}

function getOrganizationMembers(query, organizationId) {
	return new Promise(async (resolve, reject) => {
		try {
			let userOrganizationRelations = await Status.where({
				organization_id: organizationId
			}).fetchAll();
			userOrganizationRelations = userOrganizationRelations.toJSON();

			let membersInfo = [];
			console.log(`>>> after membersInfo`);
			for (const relation of userOrganizationRelations) {
				if (query === undefined) {
					console.log(`>>> empty query`);
					query = "*";
				}
				let qb = User.query();
				let member = await qb
					.where({ uuid: relation.user_id })
					.andWhere("first_name", "LIKE", query + "%")
					.columns(["uuid", "first_name", "last_name", "email"]);
				if (member.length > 0) {
					membersInfo = [...membersInfo, ...member];
				}
			}
			await Promise.all(
				membersInfo.map(async member => {
					let status = await Status.where({
						user_id: member.uuid,
						organization_id: organizationId
					}).fetch();
					member.status = status.get("status");
					member.statusUpdatedAt = status.get("updated_at");
				})
			);

			resolve({
				success: true,
				data: membersInfo,
				message: `Returned organization members`,
				code: 200
			});
		} catch (err) {
			console.log(err);
			reject({
				success: false,
				message: `Failed to return organization members.`,
				code: 200
			});
		}
	});
}

module.exports = {
	createOrganization,
	getAllOrganizationsPerAdmin,
	joinOrganization,
	getMyOrganizations,
	getOrganizationMembers
};
