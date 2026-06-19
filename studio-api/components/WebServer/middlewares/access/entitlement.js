const logger = require(`${process.cwd()}/lib/logger/logger`)
const saas = require(`${process.cwd()}/lib/saas`)

// Resolve a value from `req` either by a dot-path string ("body.channels") or a
// function (req) => value.
function resolve(spec, req) {
  if (typeof spec === "function") return spec(req)
  if (typeof spec === "string")
    return spec.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), req)
  return undefined
}

// Default org resolution: ONLY the URL org param, which the org-access
// middleware has already authorized. We deliberately do NOT fall back to
// req.body/req.query organizationId: that is attacker-controlled input the auth
// chain never validated, so trusting it would let a caller gate against (and
// pass on) a different org's plan. Conversation-/session-scoped routes that
// don't carry organizationId in the URL MUST supply an explicit `orgFrom` that
// derives the org from a server-validated source.
function defaultOrg(req) {
  return (req.params && req.params.organizationId) || null
}

/**
 * Declarative entitlement guard. Add to a route definition:
 *
 *   requireEntitlement: "collaboration"                       // boolean cap
 *   requireEntitlement: { capability: "audio.quality",
 *                         valueFrom: "body.quality" }         // enum cap (value)
 *   requireEntitlement: { capability: "live.profiles",
 *                         valueFrom: (req) => <category> }    // computed value
 *   requireEntitlement: [ ...specs ]                          // all must pass
 *
 * orgFrom / valueFrom / profileFrom = dot-path string into req, or (req)=>value.
 * Runs AFTER auth + org-access middlewares (router.js order), so
 * req.params.organizationId / req.payload.data.userId are populated.
 *
 * Gating a feature behind a plan is therefore: (1) add/flip the capability rule
 * in the plugin catalog + re-seed, (2) add this one flag on the route. The check
 * is fail-closed in the engine; this middleware is a NO-OP when the SaaS plugin
 * is absent (saas.enforce returns null), so the OSS build is unaffected.
 */
function build(spec) {
  const specs = Array.isArray(spec) ? spec : [spec]
  const normalized = specs
    .map((s) => (typeof s === "string" ? { capability: s } : s))
    .filter((s) => s && s.capability)

  return async (req, res, next) => {
    try {
      for (const cfg of normalized) {
        const orgId = cfg.orgFrom ? resolve(cfg.orgFrom, req) : defaultOrg(req)
        if (!orgId) {
          // No org to scope the plan against. This means the route declared
          // requireEntitlement without a URL :organizationId and without an
          // orgFrom -> a misconfiguration. We skip (don't 500 the request) but
          // WARN loudly so the misdeclared gate is caught in prod logs rather
          // than silently letting a premium feature through.
          logger.warn(
            `requireEntitlement(${cfg.capability}): no org resolved on ${req.method} ${req.originalUrl || req.url} — gate skipped (declare an orgFrom)`,
          )
          continue
        }
        const value =
          cfg.valueFrom !== undefined ? resolve(cfg.valueFrom, req) : cfg.value
        const profile =
          cfg.profileFrom !== undefined
            ? resolve(cfg.profileFrom, req)
            : cfg.profile
        // Throws SaasQuotaExceeded(402) / SaasFeatureLocked(403) on deny; no-op
        // (returns null) when the plugin is absent.
        await saas.enforce({
          orgId: String(orgId),
          capability: cfg.capability,
          value,
          profile,
        })
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = { build }
