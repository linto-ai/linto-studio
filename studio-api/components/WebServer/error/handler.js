const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:error:handler",
)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const fs = require("fs")

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

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
      formatError(req, err, true)

      const status = parseInt(err.status)
      if (isNaN(status)) {
        res.status(500).send({ message: err.message })
      } else {
        res.status(status).send({ message: err.message })
      }
      return
    } else if (err) {
      formatError(req, err, false)
      res.status(500).send({ message: err.message })
      return
    }
    next()
  })
}

function formatError(req, err, isHandledError = false) {
  const userId = req?.payload?.data?.userId || null
  const action = `${req.method} ${req.url}`
  const resource = req.baseUrl || req.path
  const role = {
    value: req.payload?.data?.role || null,
    name: ROLE.print(req.payload?.data?.role || null),
  }
  const logData = {
    userId,
    action,
    resource,
    message: err.message,
    service: "webserver",
    role: role,
  }

  if (isHandledError) appLogger.log("error", logData.message, logData)
  else appLogger.log("warn", logData.message, logData)
}

module.exports = {
  init,
}
