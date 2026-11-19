// Readers of a service entry of the gateway listing
const { KNOWN_MODEL_TYPE } = require(
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

// The known model the declared type names, else the type as declared
function serviceModelType(service) {
  const declared = String(service.model_type || "")
    .trim()
    .toLowerCase()
  const known = declared.match(KNOWN_MODEL_TYPE)
  if (known) return known[0]
  return declared
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
