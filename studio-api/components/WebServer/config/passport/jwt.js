const jwtDecode = require("jwt-decode")
const verifyJwt = require("jsonwebtoken")
const { generateSecretFromHeaders } = require("./middleware")
const algorithm = process.env.JWT_ALGORITHM || "HS256"

/**
 * Verify a JWT token standalone (without socket.io or Express context).
 * Returns the decoded user data { userId, tokenId, role, ... } or null.
 */
async function verifyJwtStandalone(token) {
  if (!token) return null
  try {
    const tokenData = jwtDecode(token + "")

    // Reject public session tokens for editor access
    if (tokenData?.data?.fromPublic && tokenData?.data?.fromSession) {
      return null
    }

    if (!tokenData?.data?.userId || !tokenData?.data?.tokenId) return null

    const secret = await generateSecretFromHeaders(undefined, {
      payload: tokenData,
    })

    return new Promise((resolve) => {
      verifyJwt.verify(
        token,
        secret,
        { algorithms: [algorithm] },
        (err, decoded) => {
          if (err) resolve(null)
          else resolve(decoded.data)
        },
      )
    })
  } catch (err) {
    return null
  }
}

module.exports = { verifyJwtStandalone }
