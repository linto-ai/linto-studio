// Thin, guarded bridge to the private `linto-saas` plugin. Every call is a
// NO-OP when the plugin is absent (open-source build) or not yet loaded, so the
// OSS core behaves exactly as before. SaaS mode = the CloudService component is
// in COMPONENTS and the `linto-saas` package is installed.
const { SaasQuotaExceeded, SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)

let mod = null
try {
  // Optional dependency: require may legitimately fail in the OSS build.
  mod = require("linto-saas")
} catch (e) {
  mod = null
}

// The running PaymentProcessor instance, or null if SaaS is off.
function plugin() {
  if (!mod) return null
  try {
    return mod.getInstance()
  } catch (e) {
    return null // created lazily by CloudService; not ready yet
  }
}

function enabled() {
  return plugin() != null
}

// Gate a call site. Throws a studio error (402/403) on deny, mapped to the
// upgrade CTA by the front-end. No-op when SaaS is off.
async function enforce({ orgId, capability, value, profile }) {
  const pp = plugin()
  if (!pp) return null
  const v = await pp.entitlements.checkEntitlement({
    orgId,
    capability,
    value,
    profile,
  })
  if (!v.allowed) {
    const extras = {
      reason: v.reason,
      capability: v.capability,
      remaining: v.remaining,
    }
    if (v.reason === "quota_exceeded") {
      throw new SaasQuotaExceeded(`Quota exceeded: ${capability}`, extras)
    }
    throw new SaasFeatureLocked(`Not on your plan: ${capability}`, extras)
  }
  return v
}

// Record usage. FAIL-SOFT: never throws, never blocks a request that passed.
async function record(args) {
  const pp = plugin()
  if (!pp) return
  try {
    await pp.entitlements.recordUsage(args)
  } catch (e) {
    /* fail-soft */
  }
}

// Record a finished live session (idempotent by sessionId). FAIL-SOFT.
async function recordLive(args) {
  const pp = plugin()
  if (!pp) return
  try {
    await pp.entitlements.recordLiveSession(args)
  } catch (e) {
    /* fail-soft */
  }
}

// Sync the org's seat count (derived from membership) into billing. FAIL-SOFT.
async function syncSeats(orgId, seatCount) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.syncSeats(orgId, seatCount)
  } catch (e) {
    /* fail-soft */
  }
}

// Backoffice: flag/unflag an org as comp (fullest plan, no billing). FAIL-SOFT.
// Backoffice: switch an org between the ordinary SaaS mode and MANAGED (we
// host this customer; every gate is bypassed plugin-side). NO-OP in OSS.
async function setOrgMode(orgId, mode) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.setOrgMode(orgId, mode)
  } catch (e) {
    /* fail-soft */
  }
}

async function setBillingExempt(orgId, exempt) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.setBillingExempt(orgId, exempt)
  } catch (e) {
    /* fail-soft */
  }
}

// RGPD: erase an org's billing/usage footprint (cancel its Stripe subscription,
// drop saas_subscriptions + saas_usage_ledger rows). FAIL-SOFT, NO-OP in OSS.
// NB: the Stripe CUSTOMER is intentionally RETAINED here (invoices have a ~10y
// legal accounting-retention obligation). The hard-erase of the customer is an
// INTENTIONALLY out-of-band operator action run after the retention window via
// pp.purgeOrganization(orgId, { deleteStripeCustomer: true }) — not wired to org
// deletion on purpose. See docs/saas/legal/RETENTION-ET-EFFACEMENT.md.
async function purgeOrganization(orgId) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.purgeOrganization(orgId)
  } catch (e) {
    /* fail-soft */
  }
}

// RGPD: anonymize a user's footprint across the billing plugin (usage-ledger
// userId attribution). FAIL-SOFT, NO-OP in OSS.
async function purgeUser(userId) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.purgeUser(userId)
  } catch (e) {
    /* fail-soft */
  }
}

// Resolve an ASR backend / transcriber profile to its billing CATEGORY
// (local-standard | local-gpu | external). Needed to gate `live.profiles`
// (an enum keyed on category, NOT on the raw backend). Returns null in OSS.
function categoryOf(profile) {
  const pp = plugin()
  if (!pp || !pp.utils || !pp.utils.profiles) return null
  try {
    return pp.utils.profiles.categoryOf(profile)
  } catch (e) {
    return null
  }
}

// Strict: returns the category only for a recognized backend, else null (used
// by the live-access gate to avoid treating an unknown backend as free tier).
function categoryOfStrict(profile) {
  const pp = plugin()
  if (!pp || !pp.utils || !pp.utils.profiles) return null
  try {
    return pp.utils.profiles.categoryOfStrict(profile)
  } catch (e) {
    return null
  }
}

module.exports = {
  plugin,
  enabled,
  enforce,
  record,
  recordLive,
  syncSeats,
  setBillingExempt,
  setOrgMode,
  purgeOrganization,
  purgeUser,
  categoryOf,
  categoryOfStrict,
}
