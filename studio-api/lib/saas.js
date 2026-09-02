// Bridge to the private `linto-saas` plugin. Every function is a no-op when the
// plugin is absent (open-source build) so the core behaves exactly as before.
// SaaS mode = CloudService in COMPONENTS and the `linto-saas` package installed.
const { SaasQuotaExceeded, SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)

let mod = null
try {
  mod = require("linto-saas")
} catch (e) {
  mod = null
}

// The running PaymentProcessor, or null when SaaS is off.
function plugin() {
  if (!mod) return null
  try {
    return mod.getInstance()
  } catch (e) {
    return null
  }
}

function enabled() {
  return plugin() != null
}

const PAYMENT_REQUIRED = new Set(["quota_exceeded", "credit_exhausted"])

function throwDenied(verdict, capability) {
  const extras = {
    reason: verdict.reason,
    capability: verdict.capability || capability,
    remaining: verdict.remaining != null ? verdict.remaining : null,
  }
  if (PAYMENT_REQUIRED.has(verdict.reason)) {
    throw new SaasQuotaExceeded(`Quota exceeded: ${capability}`, extras)
  }
  throw new SaasFeatureLocked(`Not on your plan: ${capability}`, extras)
}

// Gate a call site. Throws 402 (quota, credit) or 403 (feature) on deny.
// Fail-closed inside the plugin: an internal error denies.
async function enforce({ orgId, capability, value }) {
  const pp = plugin()
  if (!pp) return null
  const v = await pp.entitlements.check({ orgId, capability, value })
  if (!v.allowed) throwDenied(v, capability)
  return v
}

// Admission of a live (microphone, bot): balance >= admission x languages.
// Throws 402 on an empty balance.
async function liveAdmit({ orgId, languages }) {
  const pp = plugin()
  if (!pp) return null
  const v = await pp.entitlements.liveAdmit({ orgId, languages })
  if (!v.allowed) throwDenied(v, "live.minutes")
  return v
}

// Record usage. Fail-soft: never throws, never blocks a request that passed.
async function record(args) {
  const pp = plugin()
  if (!pp) return
  try {
    await pp.entitlements.record(args)
  } catch (e) {
    /* fail-soft */
  }
}

// Express middleware slot after authentication: counts machine-token API calls.
// Returns a pass-through when SaaS is off or the plugin did not build one.
function afterAuth() {
  // Resolved per request: routes load before CloudService creates the plugin.
  return (req, res, next) => {
    const pp = plugin()
    if (!pp || typeof pp.hostAfterAuth !== "function") return next()
    return pp.hostAfterAuth(req, res, next)
  }
}

// Seats derived from membership (role >= uploader) -> subscription + Stripe. Fail-soft.
async function syncSeats(orgId, seatCount) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.syncSeats(orgId, seatCount)
  } catch (e) {
    /* fail-soft */
  }
}

// RGPD: erase an org's billing footprint (Stripe subscription canceled, local
// rows dropped). The Stripe customer is kept for the legal retention of invoices.
async function purgeOrganization(orgId) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.purgeOrganization(orgId)
  } catch (e) {
    /* fail-soft */
  }
}

// RGPD: anonymize a departing user in the ledger.
async function purgeUser(userId) {
  const pp = plugin()
  if (!pp) return
  try {
    return await pp.purgeUser(userId)
  } catch (e) {
    /* fail-soft */
  }
}

module.exports = {
  plugin,
  enabled,
  enforce,
  liveAdmit,
  record,
  afterAuth,
  syncSeats,
  purgeOrganization,
  purgeUser,
}
