const rateLimit = require("express-rate-limit")
const authFailLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minute
  max: 5, // block after 3 failed attempts
  message: "Too many failed attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
})

// Identity bridge (POST /api/auth/external/token): one caller (the Meet
// backend) asks once per participant per panel opening; keyed by IP.
const externalExchangeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.EXTERNAL_EXCHANGE_RATE_LIMIT, 10) || 300,
  message: "Too many identity exchanges, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
})

module.exports = { authFailLimiter, externalExchangeLimiter }
