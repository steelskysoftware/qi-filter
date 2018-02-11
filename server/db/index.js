const config = require('../config')
const knex = require('knex')

module.exports = knex({
  client: 'pg',
  connection: config.postgres,
  pool: { min: 2, max: 10 },
})
