const debug = require("debug")("linto:app:webserver:middlewares:logger")
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

function logger(req, res, next) {
  // Auto-attach request context
  req.logContext = {
    userId: req.payload?.data?.userId || null,
    role: {
      value: req.payload?.data?.role || null,
      name: ROLE.print(req.payload?.data?.role || null),
    },
    service: "webserver",
  }

  // Log the incoming request as structured log
  const action = `${req.method} ${req.url}`
  const resource = req.baseUrl || req.path
  const message =
    req.body && Object.keys(req.body).length > 0
      ? req.url === "/auth/login"
        ? JSON.stringify({ email: req.body.email })
        : JSON.stringify(req.body)
      : null

  const logData = {
    ...req.logContext,
    action,
    resource,
    message,
  }

  const level = req.logContext.role > 1 ? "info" : "debug"
  appLogger.log(level, logData.message || `${req.method} ${req.url}`, logData)

  // Intercept 400+ responses with JSON body
  const originalJson = res.json
  res.json = function (body) {
    if (body?.error) {
      appLogger.warn(body.error, {
        ...req.logContext,
        action,
        resource,
        message: body.error,
      })
    }
    return originalJson.call(this, body)
  }

  // Capture 4xx/5xx responses for logging
  const originalSend = res.send
  res.send = function (body) {
    res.locals.responseBody = body
    return originalSend.call(this, body)
  }

  res.on("finish", () => {
    if (
      res.statusCode >= 400 &&
      res.statusCode < 500 &&
      res.locals.responseBody
    ) {
      appLogger.warn(res.locals.responseBody, {
        ...req.logContext,
        action,
        resource,
        message: res.locals.responseBody,
      })
    } else if (res.statusCode >= 500) {
      appLogger.error(res.locals.responseBody || "Internal Server Error", {
        ...req.logContext,
        action,
        resource,
        message: res.locals.responseBody,
      })
    }
  })

  next()
}

module.exports = {
  logger,
}
