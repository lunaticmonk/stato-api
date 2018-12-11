
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('organizations', function(table) {
      table.increments('id').primary();
      table.uuid('uuid');
      table.text('name');
      table.text('url');
      table.text('email').unique();
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('organizations');
};
