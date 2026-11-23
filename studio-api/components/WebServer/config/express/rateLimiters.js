const { rateLimit, ipKeyGenerator } = require("express-rate-limit")

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

// The identity bridge serves all the users of an integration: keyed by caller
const externalExchangeLimiter = failLimiter({
  windowMs: 60 * 1000,
  limit: parseInt(process.env.EXTERNAL_EXCHANGE_RATE_LIMIT, 10) || 3000,
  keyGenerator: (req) =>
    req.payload?.data?.userId
      ? `user:${req.payload.data.userId}`
      : ipKeyGenerator(req.ip),
  message: { message: "Too many identity exchanges, please try again later" },
})

module.exports = { authFailLimiter, loginFailLimiter, externalExchangeLimiter }
