const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:routecontrollers:services:services",
)

const serviceUtility = require(
  `${process.cwd()}/components/WebServer/controllers/services/utility`,
)

async function getSaasServices(req, res, next) {
  try {
    const securityLevel = req.query.securityLevel || null
    const services = await serviceUtility.listSaasServices(
      req.params.scope,
      securityLevel,
    )
    res.status(200).send(services)
  } catch (err) {
    next(err)
  }
}

async function getLlmServices(req, res, next) {
  try {
    if (
      process.env.LLM_GATEWAY_SERVICES === "" ||
      process.env.LLM_GATEWAY_SERVICES === undefined
    ) {
      res.status(200).send([])
    } else {
      // Pass organizationId and securityLevel from query params if provided
      const organizationId = req.params.organizationId || null
      const securityLevel = req.query.securityLevel || null
      const services = await serviceUtility.listLlmServices(
        organizationId,
        securityLevel,
      )
      res.status(200).send(services)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getSaasServices,
  getLlmServices,
}
