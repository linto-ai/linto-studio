const debug = require("debug")("linto:components:WebServer:error:handler")
const bytes = require("bytes")
const { StudioError } = require("./exception/base")
const { ConversationFileTooLarge } = require("./exception/conversation")

const JWT_DEFAULT_EXCEPTION = "UnauthorizedError" // Default JWT exception

function buildErrorBody(err) {
  const body = { message: err.message }
  if (err.code) body.code = err.code
  if (err.maxSize !== undefined) body.maxSize = err.maxSize
  if (err.maxSizeBytes !== undefined) body.maxSizeBytes = err.maxSizeBytes
  return body
}

let init = function (webserver) {
  webserver.express.use(function (err, req, res, next) {
    if (err && err.type === "entity.too.large") {
      const maxSizeBytes =
        bytes.parse(process.env.EXPRESS_SIZE_FILE_MAX) || 500 * 1024 * 1024
      err = new ConversationFileTooLarge(
        `Payload exceeds the maximum allowed size of ${bytes.format(maxSizeBytes)}`,
        { maxSize: bytes.format(maxSizeBytes), maxSizeBytes },
      )
    }

    if (err instanceof StudioError || err.name === JWT_DEFAULT_EXCEPTION) {
      const status = parseInt(err.status)
      const body = buildErrorBody(err)
      if (isNaN(status)) return res.status(500).json(body)
      return res.status(status).json(body)
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
