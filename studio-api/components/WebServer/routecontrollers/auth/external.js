const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:auth:external",
)

const { exchangeExternalIdentity, resolveExternalIdentity } = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/exchange`,
)
const { externalExchangeLimiter } = require(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
)

/**
 * Identity bridge, two routes over one resolution of `externalEntitlements`.
 * Auth for both: a SYSTEM_ADMINISTRATOR credential with `?userScope=backoffice`.
 * Neither ever returns the long-lived key.
 */

function rateLimited(handler) {
  return async function (req, res, next) {
    externalExchangeLimiter(req, res, async (limited) => {
      if (limited) return next(limited)
      try {
        const result = await handler(req.body, req.payload.data.userId)
        res.status(200).send(result)
      } catch (err) {
        next(err)
      }
    })
  }
}

/**
 * POST /api/auth/external/resolve  { provider, subject?, email? }
 *   → 200 { organizationId, capabilities: { quickMeeting, transcription: {…} } }
 *   → 404 { code: "no_entitlement" }
 * NO side effect: no key, no token, no organization. Called at login and at
 * room opening to decide which entries the interface shows.
 */
const resolveIdentity = rateLimited(resolveExternalIdentity)

/**
 * POST /api/auth/external/token  { provider, subject?, email? }
 *   → 200 { token, expiresIn, expiresAt, userId, organizationId,
 *           capabilities, externalIdentity, created }
 *   → 404 { code: "no_entitlement" }   no entitlement, or every feature off
 *   → 403 { code: "revoked" }          the linked key has been revoked
 * Creates the key just-in-time, in the organization the resolution yields,
 * when the person has an entitlement and no key yet.
 */
const exchangeToken = rateLimited(exchangeExternalIdentity)

module.exports = { resolveIdentity, exchangeToken }
