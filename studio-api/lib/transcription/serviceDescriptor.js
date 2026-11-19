// Readers of a service entry of the gateway listing
const { knownModelType } = require(
  `${process.cwd()}/lib/transcription/modelTypes`,
)

// The path the gateway proxies the service under
function serviceEndpoint(service) {
  if (Array.isArray(service.endpoints) && service.endpoints.length > 0) {
    return String(
      service.endpoints[0].endpoint || service.endpoints[0],
    ).replace(/^\/+/, "")
  }
  return service.serviceName || service.name || null
}

function serviceModelType(service) {
  return knownModelType(service.model_type)
}

// The gateway may serialize the info of a sub-service
function parseInfo(info) {
  if (info == null) return null
  if (typeof info === "object") return info
  try {
    return JSON.parse(info)
  } catch (err) {
    return null
  }
}

module.exports = { serviceEndpoint, serviceModelType, parseInfo }
