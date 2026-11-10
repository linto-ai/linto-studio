const rateLimit = require("express-rate-limit")

const FAIL_WINDOW_MS = 2 * 60 * 1000
const FAIL_MAX_ATTEMPTS = 5

function failLimiter(options = {}) {
  return rateLimit({
    windowMs: FAIL_WINDOW_MS,
    limit: FAIL_MAX_ATTEMPTS,
    message: { message: "Too many failed attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    ...options,
  })
}

// Invoked by hand on a failed session password (forwardSessionAlias)
const authFailLimiter = failLimiter()

// Plain middleware on the login routes, successful logins are not counted
const loginFailLimiter = failLimiter({ skipSuccessfulRequests: true })

module.exports = { authFailLimiter, loginFailLimiter }
