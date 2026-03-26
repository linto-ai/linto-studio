const debug = require("debug")("linto:components:WebServer:error:handler")
const { AppError } = require("./exception/base")

const JWT_DEFAULT_EXCEPTION = "UnauthorizedError" // Default JWT exception

let init = function (webserver) {
  webserver.express.use(function (err, req, res, next) {
    if (err instanceof AppError || err.name === JWT_DEFAULT_EXCEPTION) {
      const status = parseInt(err.status)
      if (isNaN(status)) return res.status(500).send({ message: err.message })
      else return res.status(status).send({ message: err.message })
    } else if (err) {
      debug("Error handler caught an error:", err)
      debug(err)
      return res.status(500).send({ message: err.message })
    }
    next()
  })
}

module.exports = {
  init,
}
