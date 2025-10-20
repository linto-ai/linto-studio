const debug = require("debug")("linto:app:webserver:middlewares:logger")
const LogManager = require(`${process.cwd()}/lib/logger/manager`)

async function logger(req, res, next) {
  // Build structured context for the request
  const message =
    req.body && Object.keys(req.body).length > 0
      ? req.url === "/auth/login"
        ? JSON.stringify({ email: req.body.email })
        : JSON.stringify(req.body)
      : null

  LogManager.logWebserverEvent(req, message)

  // Intercept 400+ JSON responses
  const originalJson = res.json
  res.json = function (body) {
    if (body?.error) {
      LogManager.logWebserverEvent(req, body.error, { level: "warn" })
    }
    return originalJson.call(this, body)
  }

  // Capture 4xx/5xx raw responses
  const originalSend = res.send
  res.send = function (body) {
    res.locals.responseBody = body
    return originalSend.call(this, body)
  }

  res.on("finish", () => {
    const status = res.statusCode
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : null
    if (!level) return // Only log 4xx and 5xx responses

    const message =
      res.locals.responseBody ?? (status >= 500 ? "Internal Server Error" : "")
    LogManager.logWebserverEvent(req, message)
  })

  next()
}

module.exports = { logger }
