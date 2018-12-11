
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.uuid('organiation_id').references('uuid').inTable('organizations');
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('organization_id');
  });
};
