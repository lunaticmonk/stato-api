"use strict";

const db = require("../database");

const Status = db.Model.extend({
	tableName: "status",
	hasTimestamps: true,
	idAttribute: null
});

module.exports = Status;
