exports.up = function(knex, Promise) {
  return knex.schema.createTable('guests', function(table) {
    table.increments()
    table.string('name')
    table.string('tag')

    table.index(['name', 'tag'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('guests')
};
