
exports.up = function(knex, Promise) {
  return knex.schema.table('videos', function(table) {
    table.string('title')
  })
};

exports.down = function(knex, Promise) {
  table.dropColumn('title')
};
