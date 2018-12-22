exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.dropColumn("organization_id");
			table.dropColumn("status");
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table
				.uuid("organization_id")
				.references("uuid")
				.inTable("organizations");
			table.enu("status", ["online", "inactive", "working", "detox"]);
		})
	]);
};
