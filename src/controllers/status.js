"use strict";

const uuid = require("uuid/v1");
const logger = require("../logger");
const Organization = require("../models/organization");
const User = require("../models/user");
const Status = require("../models/status");
const userController = require("./user");

function getStatus(query) {
	return new Promise(async (resolve, reject) => {
		try {
			const { user_id, organization_id } = query;
			const status = await Status.where({
				user_id,
				organization_id
			}).fetch();
			resolve({
				success: true,
				data: status,
				message: `Retrieved status for uuid`,
				code: 200
			});
		} catch (err) {
			console.log(err);
			reject({
				success: false,
				message: "Error retrieving status.",
				code: 200
			});
		}
	});
}

function updateStatus(body) {
	return new Promise(async (resolve, reject) => {
		try {
			const { user_id: userId, organization_id: organizationId, status } = body;

			const updatedStatus = await Status.where({
				user_id: userId,
				organization_id: organizationId
			}).save(
				{
					status
				},
				{ method: "update" }
			);
			resolve({
				success: true,
				data: updatedStatus,
				message: `Updated user status.`,
				code: 200
			});
		} catch (err) {
			console.log(err);
			reject({
				success: false,
				message: `Failed to update user status.`,
				code: 200
			});
		}
	});
}

module.exports = {
	updateStatus,
	getStatus
};
