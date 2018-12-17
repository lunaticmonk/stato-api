exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("organizations", function(table) {
            table.uuid('admin');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("organizations", function(table) {
			table.dropColumn("admin");
		})
	]);
};
