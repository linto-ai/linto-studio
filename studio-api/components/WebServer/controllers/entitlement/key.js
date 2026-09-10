const debug = require("debug")(
  "linto:components:WebServer:controllers:entitlement:key",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const logger = require(`${process.cwd()}/lib/logger/logger`)
const TokenHandler = require(
  `${process.cwd()}/components/WebServer/controllers/apikey/token`,
)

/**
 * The API key standing for an external identity, and the hygiene operations
 * an entitlement change triggers on it.
 *
 * The key carries the IDENTITY only (`metadata.externalIdentity`,
 * `metadata.quickMeeting`); the rights live in `externalEntitlements` and are
 * read live by the server gates. Revoking its tokens is therefore hygiene, not
 * the security mechanism: it makes an already-minted short token useless
 * sooner, while the gates refuse the call anyway.
 */

function firstOf(result) {
  return Array.isArray(result) && result.length > 0 ? result[0] : null
}

/** The key standing for this identity: (provider, subject) first, then email. */
async function findLinkedKey({ provider, subject, email }) {
  if (subject) {
    const key = firstOf(
      await model.users.findApiKeyByExternalIdentity({ provider, subject }),
    )
    if (key) return key
  }
  if (email) {
    // The email is the pivot between systems: a key provisioned by another
    // provider (e.g. Twake) for the same person is the same person. [P]
    return firstOf(await model.users.findApiKeyByExternalEmail({ email }))
  }
  return null
}

function hasValidToken(rows) {
  const now = Date.now()
  return (Array.isArray(rows) ? rows : []).some(
    (row) => !row.expiresAt || new Date(row.expiresAt).getTime() > now,
  )
}

/**
 * Rights taken away (`features: {}` or `DELETE users`): drop the key's tokens.
 * The key stays a member of its organization — the ledger keeps its
 * attribution and a later re-activation finds it again.
 */
async function revokeLinkedKey(identity) {
  const key = await findLinkedKey(identity)
  if (!key) return { revoked: false }
  const userId = key._id.toString()
  await model.tokens.deleteAllUserTokens(userId)
  logger.info(
    `entitlements: tokens of key ${userId} revoked (${identity.provider}:${identity.subject || identity.email})`,
  )
  return { revoked: true, userId }
}

/**
 * Rights given back after a revocation: mint the key's own token again, so the
 * identity exchange stops answering `403 revoked`. A key an administrator
 * revoked by hand and that no entitlement re-activates stays revoked.
 */
async function reactivateLinkedKey(identity) {
  const key = await findLinkedKey(identity)
  if (!key) return { reactivated: false }
  const userId = key._id.toString()
  const rows = await model.tokens.getTokenByUser(userId)
  if (hasValidToken(rows)) return { reactivated: false, userId }
  await TokenHandler.generateApiKeyToken(
    userId,
    undefined,
    process.env.EXTERNAL_JIT_KEY_EXPIRES_IN || "3650d",
  )
  logger.info(
    `entitlements: key ${userId} re-activated (${identity.provider}:${identity.subject || identity.email})`,
  )
  return { reactivated: true, userId }
}

module.exports = {
  findLinkedKey,
  hasValidToken,
  revokeLinkedKey,
  reactivateLinkedKey,
}
