const debug = require("debug")(
  "linto:components:WebServer:controllers:services:utility",
)
const { ServiceError } = require(
  `${process.cwd()}/components/WebServer/error/exception/service`,
)

const axios = require(`${process.cwd()}/lib/utility/axios`)
const SECURITY_LEVELS = require(
  `${process.cwd()}/lib/dao/conversation/securityLevels`,
)

async function fetchGatewayServices(scope) {
  try {
    let host = process.env.GATEWAY_SERVICES + "/gateway/services"
    if (scope) host += `/${scope}`
    return await axios.get(host)
  } catch (err) {
    throw new ServiceError("Gateway service unreachable")
  }
}

// Transcription services by security level (a service may only be used for a
// conversation whose level it meets); a null level keeps them all.
function filterBySecurityLevel(transcriptionServices, securityLevel) {
  return transcriptionServices.filter((service) =>
    SECURITY_LEVELS.isAllowed(service.security_level, securityLevel),
  )
}

async function listSaasServices(scope, securityLevel = null) {
  const saas_service_info = await fetchGatewayServices(scope)
  // NLP services are not filtered
  return [
    ...filterBySecurityLevel(saas_service_info.transcription, securityLevel),
    ...saas_service_info.nlp,
  ]
}

async function listTranscriptionServices(securityLevel = null) {
  const saas_service_info = await fetchGatewayServices()
  return filterBySecurityLevel(saas_service_info.transcription, securityLevel)
}

// Whether a transcription service exposes the endpoint a client sent.
function matchesEndpoint(service, endpoint) {
  const norm = (e) =>
    String(e || "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
  const target = norm(endpoint)
  return (
    target !== "" &&
    Array.isArray(service.endpoints) &&
    service.endpoints.some((ep) => norm(ep.endpoint) === target)
  )
}

/**
 * List LLM services from LLM Gateway V2
 * V2 API uses /api/v1/services with pagination
 * @param {string} [organizationId] - Optional organization ID to filter services
 *   If provided, returns services for that organization + global services (organization_id=null)
 *   If not provided, returns all services
 * @param {string} [securityLevel] - Optional security level to filter flavors
 *   Flavors are filtered by model.security_level, services with no remaining flavors are removed
 * @param {string} [userId] - Optional user ID; also returns services whose allowed
 *   user list includes this user (in addition to global + org services)
 *
 * Only services listed for the LLM_GATEWAY_SCOPE usage scope (default "linto",
 * the LinTO Studio scope) are returned: the gateway also serves other client
 * products (LinTO Meet, Twake) with their own services.
 */
async function listLlmServices(
  organizationId = null,
  securityLevel = null,
  userId = null,
) {
  try {
    const gateway_services = process.env.LLM_GATEWAY_SERVICES
    debug("Security level requested:", securityLevel)
    // V2 API endpoint with pagination, restricted to the Studio usage scope
    const scope = process.env.LLM_GATEWAY_SCOPE || "linto"
    let host =
      gateway_services +
      `/api/v1/services?page=1&page_size=100&scope=${encodeURIComponent(scope)}`

    // Add organization filter if provided. The gateway returns global services
    // plus those whose allowed org/user lists include the caller.
    if (organizationId) {
      host += `&organization_id=${encodeURIComponent(organizationId)}`
    }
    // Add user filter so services scoped to this specific user are also returned
    if (userId) {
      host += `&user_id=${encodeURIComponent(userId)}`
    }

    // Add timeout to prevent hanging if LLM Gateway is unresponsive
    const response = await axios.get(host, { timeout: 5000 })

    // V2 returns { items: [...], total: N, page: 1, page_size: 100, pages: N }
    // Transform to match expected format for frontend compatibility
    const services = response.items || []

    return (
      services
        .map((service) => {
          // Filter flavors by active status and security level
          const filteredFlavors = (service.flavors || [])
            .filter((flavor) => flavor.is_active !== false)
            .filter((flavor) =>
              SECURITY_LEVELS.isAllowed(
                flavor.model?.security_level,
                securityLevel,
              ),
            )
            .map((flavor) => ({
              id: flavor.id,
              name: flavor.name,
              description: flavor.description,
              is_active: flavor.is_active,
              is_default: flavor.is_default,
              processing_mode: flavor.processing_mode,
              output_type: flavor.output_type,
              model: flavor.model,
            }))

          return {
            id: service.id,
            name: service.name,
            route: service.route,
            service_type: service.service_type,
            service_category: service.service_category || null,
            description: service.description,
            is_active: service.is_active,
            flavors: filteredFlavors,
          }
        })
        // Exclude inactive services
        .filter((service) => service.is_active !== false)
        // Exclude chat services (used separately by ChatDrawer)
        .filter((service) => service.service_type !== "chat")
        // Remove services with no flavors
        .filter((service) => service.flavors.length > 0)
    )
  } catch (err) {
    debug("LLM Gateway service unreachable:", err.message)
    return []
  }
}

module.exports = {
  listSaasServices,
  listTranscriptionServices,
  listLlmServices,
  matchesEndpoint,
}
