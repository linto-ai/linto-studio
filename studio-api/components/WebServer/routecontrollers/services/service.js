const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:services:service",
)

const serviceUtility = require(
  `${process.cwd()}/components/WebServer/controllers/services/utility`,
)

async function getSaasServices(req, res, next) {
  try {
    if (!process.env.GATEWAY_SERVICES?.trim()) {
      return res
        .status(503)
        .send({ message: "Gateway service is not configured", services: [] })
    }
    const securityLevel = req.query.securityLevel || null
    const services = await serviceUtility.listSaasServices(
      req.params.scope,
      securityLevel,
    )
    res.status(200).send(services)
  } catch (err) {
    res
      .status(503)
      .send({ message: "Gateway service unreachable", services: [] })
  }
}

async function getLlmServices(req, res, next) {
  try {
    if (!process.env.LLM_GATEWAY_SERVICES?.trim()) {
      return res
        .status(503)
        .send({
          message: "LLM Gateway service is not configured",
          services: [],
        })
    }
    // Pass organizationId and securityLevel from query params if provided
    const organizationId = req.params.organizationId || null
    const securityLevel = req.query.securityLevel || null
    const services = await serviceUtility.listLlmServices(
      organizationId,
      securityLevel,
    )
    res.status(200).send(services)
  } catch (err) {
    res
      .status(503)
      .send({ message: "LLM Gateway service unreachable", services: [] })
  }
}

module.exports = {
  getSaasServices,
  getLlmServices,
}
