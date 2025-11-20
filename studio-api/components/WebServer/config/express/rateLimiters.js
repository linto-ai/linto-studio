const rateLimit = require("express-rate-limit")
const authFailLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minute
  max: 5, // block after 3 failed attempts
  message: "Too many failed attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false },
})

module.exports = { authFailLimiter }
