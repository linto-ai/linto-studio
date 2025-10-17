const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:error:handler",
)
const { logger, context } = require(`${process.cwd()}/lib/logger`)

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
      formatError(req, err, "warn")

      const status = parseInt(err.status)
      if (isNaN(status)) {
        res.status(500).send({ message: err.message })
      } else {
        res.status(status).send({ message: err.message })
      }
      return
    } else if (err) {
      formatError(req, err, "error")
      res.status(500).send({ message: err.message })
      return
    }
    next()
  })
}

async function formatError(req, err, level) {
  const ctx = await context.createContext(req, err, { level })
  logger.log(ctx.level, ctx.message, ctx)
}

module.exports = {
  init,
}
