// Update with your config settings.
const config = require('./server/config')
const { parse } = require('pg-connection-string')
const connection = parse(config.postgres)

module.exports = {
  client: 'postgresql',
  connection: connection,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
