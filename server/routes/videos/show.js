const Promise = require('bluebird')
const error = require('http-errors')
const knex = require('../../db')
const serialize = require('../../middlewares/serialize')
const schema = require('../../db/schema')

async function handler(req, res, next) {
  const video = knex('videos')
    .where('id', req.params.id)
    .first()

  return Promise.props({video})
}

module.exports = [
  serialize(handler)
]
