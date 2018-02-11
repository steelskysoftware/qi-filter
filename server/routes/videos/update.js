const Promise = require('bluebird')
const fetch = require('isomorphic-fetch')
const error = require('http-errors')
const Joi = require('joi')

const knex = require('../../db')
const schema = require('../../db/schema')
const config = require('../../config')
const serialize = require('../../middlewares/serialize')
const joi = require('../../middlewares/joi')

const video = Joi.object().keys({
  'views': Joi.number()
})

function validations() {
  var videoValidations = joi(video)

  return function validate(req, res, next) {
    return videoValidations(req, res, next)
  }
}

async function update(req, res, next) {
  const updates = Object.assign({updatedAt: knex.raw('NOW()')}, req.joi)
  const updated = await knex('videos').where(req.params).update(updates)

  return req.joi
}

module.exports = [
  validations(),
  serialize(update)
]
