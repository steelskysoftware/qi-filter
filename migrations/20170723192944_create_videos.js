exports.up = function(knex, Promise) {
  return knex.schema.createTable('videos', function(table) {
    table.increments()
    table.string('title')
    table.string('url')
    table.jsonb('tags')
      .defaultTo(JSON.stringify({}))
    table.integer('views')
    table.timestamp('createdAt')

    table.index(['title', 'url', 'tags'])
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('videos')
};
