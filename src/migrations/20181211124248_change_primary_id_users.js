
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.dropColumn('id');
      table.uuid('uuid').primary().notNullable().alter();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.increments('id').primary();
      table.uuid('uuid');
    })
  ])
};
