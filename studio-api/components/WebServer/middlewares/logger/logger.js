const debug = require("debug")("linto:app:webserver:middlewares:logger")
const LogManager = require(`${process.cwd()}/lib/logger/manager`)

async function logger(req, res, next) {
  const originalJson = res.json
  res.json = function (body) {
    res.locals.responseBody = body
    return originalJson.call(this, body)
  }

  const originalSend = res.send
  res.send = function (body) {
    res.locals.responseBody = body
    return originalSend.call(this, body)
  }

  res.on("finish", () => {
    const status = res.statusCode
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info"

    let message = undefined
    if (status >= 400 && res?.locals?.responseBody)
      message = res.locals.responseBody
    else if (status >= 400) {
      message =
        res.locals.responseBody ??
        (status >= 500 ? "Internal Server Error" : "")
    }

    LogManager.logWebserverEvent(req, message, { level })
  })

  next()
}

module.exports = { logger }
