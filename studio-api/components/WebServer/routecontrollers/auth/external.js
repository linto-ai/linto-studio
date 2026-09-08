const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:auth:external",
)

const { exchangeExternalIdentity } = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)
const { externalExchangeLimiter } = require(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
)

/**
 * POST /api/auth/external/token  { provider, subject?, email? }
 *   → 200 { token, expiresIn, expiresAt, userId, organizationId,
 *           capabilities: { quickMeeting }, externalIdentity, created }
 *   → 404 { code: "no_linked_key" }   no key stands for this identity
 *   → 403 { code: "revoked" }         the linked key has been revoked
 * Auth: an INTEGRATION credential (or a SYSTEM_ADMINISTRATOR with
 * `?userScope=backoffice`). The response never contains the long-lived key.
 */
async function exchangeToken(req, res, next) {
  externalExchangeLimiter(req, res, async (limited) => {
    if (limited) return next(limited)
    try {
      const result = await exchangeExternalIdentity(
        req.body,
        req.payload.data.userId,
      )
      res.status(200).send(result)
    } catch (err) {
      next(err)
    }
  })
}

module.exports = { exchangeToken }
