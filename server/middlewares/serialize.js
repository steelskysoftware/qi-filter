module.exports = function(cb) {
  return async function(req, res, next) {
    try {
      const response = await cb(req, res, next)
      res.json(response)
    } catch(err) {
      console.error(err)
      res
        .status(err.status || 500)
        .json({
          error: err.message,
          message: err.message,
          details: err.details
        })
    }
  }
}
