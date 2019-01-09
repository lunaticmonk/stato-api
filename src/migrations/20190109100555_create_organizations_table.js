exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("organizations", function(table) {
			table.uuid("uuid").primary().notNullable();
			table.text("name");
			table.text("url");
			table.uuid("admin");
			table.string("invite_key", 36);
			table.timestamps();
		})
	]);
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable("organizations");
};
