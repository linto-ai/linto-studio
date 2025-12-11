const debug = require("debug")(
  "linto:conversation-manager:components:WebServer:controller:services:utility",
)
const { ServiceError } = require(
  `${process.cwd()}/components/WebServer/error/exception/service`,
)

const axios = require(`${process.cwd()}/lib/utility/axios`)

async function listSaasServices(scope) {
  try {
    const gateway_services = process.env.GATEWAY_SERVICES
    let services = []

    let host = gateway_services + "/gateway/services"
    if (scope) host += `/${scope}`

    const saas_service_info = await axios.get(host)
    for (const transcription_service of saas_service_info.transcription) {
      services.push(transcription_service)
    }

    for (const nlp_service of saas_service_info.nlp) {
      services.push(nlp_service)
    }

    return services
  } catch (err) {
    throw new ServiceError("Error while listing services")
  }
}

/**
 * List LLM services from LLM Gateway V2
 * V2 API uses /api/v1/services with pagination
 * @param {string} [organizationId] - Optional organization ID to filter services
 *   If provided, returns services for that organization + global services (organization_id=null)
 *   If not provided, returns all services
 */
async function listLlmServices(organizationId = null) {
  try {
    const gateway_services = process.env.LLM_GATEWAY_SERVICES

    // V2 API endpoint with pagination
    let host = gateway_services + "/api/v1/services?page=1&page_size=100"

    // Add organization filter if provided
    if (organizationId) {
      host += `&organization_id=${encodeURIComponent(organizationId)}`
    }

    const response = await axios.get(host)

    // V2 returns { items: [...], total: N, page: 1, page_size: 100, pages: N }
    // Transform to match expected format for frontend compatibility
    const services = response.items || []

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      route: service.route,
      service_type: service.service_type,
      service_category: service.service_category || null,
      description: service.description,
      is_active: service.is_active,
      flavors: (service.flavors || []).map((flavor) => ({
        id: flavor.id,
        name: flavor.name,
        description: flavor.description,
        is_active: flavor.is_active,
        is_default: flavor.is_default,
        processing_mode: flavor.processing_mode,
        output_type: flavor.output_type,
        model: flavor.model,
      })),
    }))
  } catch (err) {
    debug("Error listing LLM services:", err.message)
    throw new ServiceError("Error while listing LLM services")
  }
}

module.exports = { listSaasServices, listLlmServices }
