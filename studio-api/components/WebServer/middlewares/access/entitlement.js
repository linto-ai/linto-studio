const debug = require("debug")(
  "linto:components:WebServer:middlewares:access:entitlement",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const USER_TYPE = require(`${process.cwd()}/lib/dao/users/types`)
const { resolveEntitlement, hasFeature } = require(
  `${process.cwd()}/components/WebServer/controllers/entitlement/resolve`,
)
const { EntitlementFeatureForbidden } = require(
  `${process.cwd()}/components/WebServer/error/exception/entitlement`,
)

/**
 * Server gates: a call made by a key that stands for an external identity
 * re-reads that identity's entitlement, every time.
 *
 * The key carries the identity, never the rights: a revocation pushed by the
 * external system is therefore effective on the very next call, whatever the
 * caller has cached and whatever is left of an already-minted short token.
 * Keys with no external identity (the historical use of API keys) and humans
 * are not concerned.
 */

async function externalIdentityOf(userId) {
  const users = await model.users.getById(userId, true)
  const user = Array.isArray(users) ? users[0] : undefined
  if (!user || user.type !== USER_TYPE.M2M) return null
  return user.metadata?.externalIdentity || null
}

/** Throws `403 no_entitlement` when the feature is not open to that key. */
async function assertExternalFeature(userId, feature) {
  const identity = await externalIdentityOf(userId)
  if (!identity) return
  const resolved = await resolveEntitlement({
    provider: identity.provider,
    subject: identity.subject,
    email: identity.email,
  })
  if (!resolved || !hasFeature(resolved.features, feature)) {
    throw new EntitlementFeatureForbidden(
      `This API key is not entitled to ${feature}`,
      { feature },
    )
  }
}

/** Route flag `requireExternalEntitlement: "transcription.async"`. */
function requireExternalFeature(feature) {
  return async (req, res, next) => {
    try {
      await assertExternalFeature(req.payload.data.userId, feature)
      next()
    } catch (err) {
      next(err)
    }
  }
}

/** Same, in the `executeBeforeResult(req, next)` shape of the proxy routes. */
function beforeExternalFeature(feature) {
  return async (req, next) => {
    try {
      await assertExternalFeature(req.payload.data.userId, feature)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  assertExternalFeature,
  requireExternalFeature,
  beforeExternalFeature,
  externalIdentityOf,
}
