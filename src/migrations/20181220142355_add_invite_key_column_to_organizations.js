exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("organizations", function(table) {
			table.string("invite_key", 32);
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("organizations", function(table) {
			table.dropColumn("invite_key");
		})
	]);
};
