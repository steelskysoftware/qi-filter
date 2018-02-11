
exports.up = function(knex, Promise) {
  return knex.schema.table('videos', function(table) {
    table.string('tags').alter()
    table.dropColumn('title')
  })
};

exports.down = function(knex, Promise) {
  table.jsonb('tags')
    .defaultTo(JSON.stringify({}))
  table.string('title')
};
