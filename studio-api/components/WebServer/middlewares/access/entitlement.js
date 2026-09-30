const saas = require(`${process.cwd()}/lib/saas`)

// Declarative SaaS gate on a route (`requireEntitlement` flag), after the auth
// and org-access middlewares. The flag's forms and rules belong to the plugin
// (SPEC-SAAS §4.3). No-op when it is absent.
function build(spec) {
  return async (req, res, next) => {
    try {
      await saas.decide("gateRoute", spec, req)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = { build }
