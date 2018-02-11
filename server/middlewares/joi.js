const Joi = require('joi')

module.exports = function useJoi(schema) {
  validate.schema = schema
  function validate(req, res, next) {
    var validation = schema
    var data = Object.assign({}, req.body, req.query, req.params)
    Joi.validate(data, validation, {stripUnknown: true}, (err, value)=> {
      if(err) return res
        .status(422)
        .json({message: err.message})
      req.joi = value
      return next()
    })
  }
  return validate
}
