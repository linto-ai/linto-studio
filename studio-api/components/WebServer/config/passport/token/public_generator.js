const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:token:public_generator",
)

const jwt = require("jsonwebtoken")
const algorithm = process.env.JWT_ALGORITHM || "HS256"

const DEFAULT_TOKEN_EXPIRATION = "1d"

function generateTokens(sessionId) {
  const payload = { fromPublic: true, fromSession: sessionId, role: 0 }
  const salt = sessionId

  const authSecret = salt + process.env.CM_JWT_SECRET

  return generateJWT(payload, authSecret)
}

function validateToken(token, secret) {
  secret = secret + process.env.CM_JWT_SECRET

  try {
    return jwt.verify(token, secret, { algorithms: [algorithm] })
  } catch (err) {
    debug("Token validation error:", err)
    return null
  }
}

// Helper function to generate a single JWT
function generateJWT(payload, secret, expiresIn) {
  return jwt.sign({ data: payload }, secret, {
    algorithm: algorithm,
    expiresIn: DEFAULT_TOKEN_EXPIRATION,
  })
}

module.exports = {
  generateTokens,
  validateToken,
}
