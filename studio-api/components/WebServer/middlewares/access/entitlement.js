const saas = require(`${process.cwd()}/lib/saas`)
const { SaasFeatureLocked } = require(
  `${process.cwd()}/components/WebServer/error/exception/saas`,
)

// Resolve a value from `req`: a dot-path string ("body.channels"), or a function
// (req) => value, possibly async.
async function resolve(spec, req) {
  if (typeof spec === "function") return spec(req)
  if (typeof spec === "string")
    return spec.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), req)
  return undefined
}

// Only the URL org param, which the org-access middleware already authorized.
// Never body or query: a caller could gate against another org's plan.
function defaultOrg(req) {
  return (req.params && req.params.organizationId) || null
}

/**
 * Declarative SaaS gate on a route:
 *
 *   requireEntitlement: "collaboration"                                   boolean
 *   requireEntitlement: { capability: "import.minutes", valueFrom: (req) => n }
 *   requireEntitlement: { capability: "ai.chat", orgFrom: async (req) => orgId }
 *   requireEntitlement: { liveAdmit: true, languagesFrom: (req) => n }    live balance
 *   requireEntitlement: { capability: "x", methods: ["post"] }             only these verbs
 *   requireEntitlement: [ ...specs ]                                      all must pass
 *
 * Runs after auth and org-access middlewares. Gating a feature is a rule in the
 * plugin catalog plus this flag. The authenticated user goes with every
 * verdict: the plugin refuses an unverified email. No-op when the plugin is
 * absent.
 */
function build(spec) {
  const specs = Array.isArray(spec) ? spec : [spec]
  const normalized = specs
    .map((s) => (typeof s === "string" ? { capability: s } : s))
    .filter((s) => s && (s.capability || s.liveAdmit))

  return async (req, res, next) => {
    try {
      if (!saas.enabled()) return next()
      const userId = req.payload && req.payload.data && req.payload.data.userId
      for (const cfg of normalized) {
        if (
          cfg.methods &&
          !cfg.methods
            .map((m) => m.toLowerCase())
            .includes(req.method.toLowerCase())
        )
          continue
        const orgId = cfg.orgFrom
          ? await resolve(cfg.orgFrom, req)
          : defaultOrg(req)
        if (!orgId) {
          // A gate that cannot find its org is a misdeclared route. Fail closed.
          throw new SaasFeatureLocked("No organization to gate against", {
            reason: "no_org",
            capability: cfg.capability || "live.minutes",
          })
        }
        if (cfg.liveAdmit) {
          const languages = cfg.languagesFrom
            ? await resolve(cfg.languagesFrom, req)
            : 1
          await saas.liveAdmit({ orgId: String(orgId), languages, userId })
          continue
        }
        const value =
          cfg.valueFrom !== undefined
            ? await resolve(cfg.valueFrom, req)
            : cfg.value
        await saas.enforce({
          orgId: String(orgId),
          capability: cfg.capability,
          value,
          userId,
        })
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = { build }
