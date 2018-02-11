const Promise = require('bluebird')
const fetch = require('isomorphic-fetch')
const error = require('http-errors')
const Joi = require('joi')
const qs = require('qs')
const _ = require('lodash')

const knex = require('../../db')
const schema = require('../../db/schema')
const config = require('../../config')
const serialize = require('../../middlewares/serialize')
const joi = require('../../middlewares/joi')

const validations = Joi.object().keys({
  tags: Joi.array().optional(),
})

async function index(req, res, next) {
  var guests = knex('guests')
  if(req.joi.tags) {
    guests = guests
      .whereIn('tag', req.joi.tags)
  }
  return Promise.props({guests})
}

module.exports = [
  joi(validations),
  serialize(index)
]
