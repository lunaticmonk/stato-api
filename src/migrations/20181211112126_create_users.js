
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.uuid('uuid');
      table.text('first_name');
      table.text('last_name');
      table.text('email').unique();
      table.text('password');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
