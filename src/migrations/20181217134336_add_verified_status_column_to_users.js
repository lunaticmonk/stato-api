exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.boolean("verified").notNullable().defaultTo(false);
			table.enu("status", ["online", "inactive", "working", "detox"]);
			table.renameColumn('organiation_id', 'organization_id');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("users", function(table) {
			table.dropColumn('verified');
			table.dropColumn('status');
			table.uuid('organiation_id').references('uuid').inTable('organizations').alter();
		})
	]);
};
