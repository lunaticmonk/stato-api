exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable("status", function(table) {
			table
				.uuid("uuid")
				.primary()
				.notNullable();
			table.enum("status", ["online", "inactive", "working", "detox"]);
			table
				.uuid("user_id")
				.references("uuid")
				.inTable("users");
			table
				.uuid("organization_id")
				.references("uuid")
				.inTable("organizations");
			table.timestamps();
		})
	]);
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable("status");
};
