const debug = require("debug")(
  "linto:components:WebServer:controllers:entitlement:resolve",
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const EntitlementModel = model.externalEntitlements.constructor
const { emailDomain } = require(`${process.cwd()}/lib/utility/externalIdentity`)

/**
 * Resolution of an external identity to its entitlement — shared by the two
 * exchange routes (`POST /api/auth/external/{resolve,token}`) and by the
 * server gates, so all three read the same state at the same moment.
 *
 *   user record (by subject at that provider, else by email) → else the record
 *   of the email's domain → else nothing.
 *
 * A record set on a person always wins over their domain. The resolution also
 * yields the TARGET organization: the organization of the domain for a member
 * of a declared domain (B2B), the root organization otherwise (B2C).
 */

function firstOf(result) {
  return Array.isArray(result) && result.length > 0 ? result[0] : null
}

async function resolveEntitlement({ provider, subject, email }) {
  let userRecord = null
  if (subject) {
    userRecord = firstOf(
      await model.externalEntitlements.findUserBySubject({ provider, subject }),
    )
  }
  if (!userRecord && email) {
    // The email is the pivot between systems, whatever the provider. [P]
    userRecord = firstOf(
      await model.externalEntitlements.findUserByEmail({ email }),
    )
  }

  const domain = emailDomain(email)
  let domainRecord = null
  if (domain) {
    const found = await model.externalEntitlements.findDomain({ domain })
    const records = Array.isArray(found) ? found : []
    // A person declared under a root organization stays in that root: only a
    // domain record of the SAME root gives them its organization. Without a
    // user record, the most recently updated root wins. [P]
    domainRecord = userRecord
      ? records.find(
          (record) => record.organizationId === userRecord.organizationId,
        ) || null
      : records[0] || null
  }

  if (!userRecord && !domainRecord) return null

  const effective = userRecord || domainRecord
  return {
    kind: userRecord
      ? EntitlementModel.KIND_USER
      : EntitlementModel.KIND_DOMAIN,
    features: effective.features || {},
    plan: effective.plan ?? null,
    provider: effective.provider,
    // Where the key of that person lives (and is created just-in-time).
    organizationId:
      domainRecord?.domainOrganizationId || effective.organizationId,
    rootOrganizationId: effective.organizationId,
    record: effective,
    domainRecord,
  }
}

/** `features` → the shape the front and the SDK read. */
function capabilitiesFrom(features = {}) {
  const nested =
    features.transcription && typeof features.transcription === "object"
      ? features.transcription
      : {}
  return {
    ...features,
    quickMeeting: nested.live === true,
    transcription: {
      ...nested,
      live: nested.live === true,
      async: nested.async === true,
    },
  }
}

/** `hasFeature(features, "transcription.live")` — an absent key is false. */
function hasFeature(features, path) {
  let node = features
  for (const part of path.split(".")) {
    if (!node || typeof node !== "object") return false
    node = node[part]
  }
  return node === true
}

function hasActiveFeature(features) {
  return EntitlementModel.hasActiveFeature(features)
}

module.exports = {
  resolveEntitlement,
  capabilitiesFrom,
  hasFeature,
  hasActiveFeature,
}
