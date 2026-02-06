const debug = require("debug")(
  "linto:components:WebServer:error:handler",
)
const fs = require("fs")

const JWT_DEFAULT_EXCEPTION = "UnauthorizedError" // Default JWT exception
const EXCEPTION_FOLDER = `${process.cwd()}/components/WebServer/error/exception/`

let init = function (webserver) {
  //Handle controller exception has API output
  let customException = [JWT_DEFAULT_EXCEPTION]

  fs.readdirSync(EXCEPTION_FOLDER).forEach((file) => {
    const Exception = require(`${EXCEPTION_FOLDER}${file}`)
    Object.keys(Exception).forEach((key) => customException.push(key))
  })

  webserver.express.use(function (err, req, res, next) {
    if (customException.indexOf(err.name) > -1) {
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
