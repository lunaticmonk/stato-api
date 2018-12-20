exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("organizations", function(table) {
			table.string("invite_key", 36).alter();
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table("organizations", function(table) {
			table.string("invite_key", 32).alter();
		})
	]);
};
