/**
 * SpeakerIdConnector: the single component that talks to the speaker
 * identification HTTP API exposed by the transcription service
 * (cf. docs/speaker-identification 05 §3, 07 §2).
 *
 * It resolves the speaker-id capable service, attaches the organization
 * security headers (X-Organization-Id + optional token), and performs the
 * voiceprint compute / upsert / delete / drop calls. It throws on failure;
 * callers (triggers, sync) decide how to react (enqueue, mark syncState).
 */

const debug = require("debug")(
  "linto:components:WebServer:controllers:speakerIdentification:connector",
)
const fs = require("fs")
const path = require("path")
const FormData = require("form-data")
const axios = require("axios").default

// Synchronous timeouts (ms), aligned with the transcription service (05 §3)
const COMPUTE_TIMEOUT = 120000
const UPSERT_TIMEOUT = 15000
const DELETE_TIMEOUT = 15000
const DROP_TIMEOUT = 30000
const INFO_TIMEOUT = 10000

// Discovery cache for the resolved service base URL
const DISCOVERY_TTL_MS = 5 * 60 * 1000
let _discoveryCache = { value: null, expiresAt: 0 }

function gatewayBase() {
  const gateway = process.env.GATEWAY_SERVICES
  if (!gateway) {
    throw new Error("GATEWAY_SERVICES is not configured")
  }
  return gateway.replace(/\/+$/, "")
}

/**
 * Resolve the base URL of the speaker-identification capable service:
 *   `${GATEWAY_SERVICES}/${endpoint}`
 * Either from SPEAKER_ID_SERVICE_ENDPOINT, or by discovery against the
 * gateway (first transcription service whose diarization sub-service exposes
 * info.speaker_identification === true). Cached for 5 minutes.
 */
async function resolveServiceBaseUrl() {
  const configured = process.env.SPEAKER_ID_SERVICE_ENDPOINT
  if (configured) {
    return `${gatewayBase()}/${configured.replace(/^\/+/, "")}`
  }

  const now = Date.now()
  if (_discoveryCache.value && _discoveryCache.expiresAt > now) {
    return _discoveryCache.value
  }

  const endpoint = await discoverSpeakerIdEndpoint()
  if (!endpoint) {
    throw new Error(
      "No speaker identification capable service found (set SPEAKER_ID_SERVICE_ENDPOINT or enable speaker identification on a diarization service)",
    )
  }
  const baseUrl = `${gatewayBase()}/${endpoint.replace(/^\/+/, "")}`
  _discoveryCache = { value: baseUrl, expiresAt: now + DISCOVERY_TTL_MS }
  return baseUrl
}

async function discoverSpeakerIdEndpoint() {
  const resp = await axios.get(`${gatewayBase()}/gateway/services`, {
    timeout: INFO_TIMEOUT,
  })
  const services = resp.data || {}
  const transcriptionServices = services.transcription || []
  for (const service of transcriptionServices) {
    const subServices =
      service.sub_services?.diarization || service.subServices?.diarization || []
    for (const diar of subServices) {
      const info = parseInfo(diar.info)
      if (info && info.speaker_identification === true) {
        // The endpoint is the path the gateway proxies this service under
        const endpoint = serviceEndpoint(service)
        if (endpoint) return endpoint
      }
    }
  }
  return null
}

function serviceEndpoint(service) {
  if (Array.isArray(service.endpoints) && service.endpoints.length > 0) {
    return String(service.endpoints[0].endpoint || service.endpoints[0]).replace(
      /^\/+/,
      "",
    )
  }
  return service.serviceName || service.name || null
}

function parseInfo(info) {
  if (info == null) return null
  if (typeof info === "object") return info
  try {
    return JSON.parse(info)
  } catch (err) {
    return null
  }
}

/** Reset the discovery cache (used by tests and after configuration changes). */
function resetDiscoveryCache() {
  _discoveryCache = { value: null, expiresAt: 0 }
}

function authHeaders(organizationId) {
  const headers = { "X-Organization-Id": organizationId.toString() }
  const token = process.env.SPEAKER_ID_API_TOKEN
  if (token) {
    headers["X-Speaker-Id-Token"] = token
  }
  return headers
}

function encodeSpeakerRef(speakerRef) {
  // "label:{id}" / "user:{id}" — the colon is path-safe but encode defensively
  return encodeURIComponent(speakerRef)
}

/**
 * Compute a voiceprint from enrollment audio files.
 * @param {string} organizationId
 * @param {string[]} absoluteFilePaths - absolute paths to audio files on disk
 * @returns {Promise<{vector:number[], modelId:string, dim:number, durationUsed:number}>}
 */
async function computeVoiceprint(organizationId, absoluteFilePaths) {
  if (!Array.isArray(absoluteFilePaths) || absoluteFilePaths.length === 0) {
    throw new Error("computeVoiceprint requires at least one audio file")
  }
  const baseUrl = await resolveServiceBaseUrl()
  const form = new FormData()
  for (const filePath of absoluteFilePaths) {
    form.append("file", fs.createReadStream(filePath), {
      filename: path.basename(filePath),
    })
  }
  const resp = await axios.post(
    `${baseUrl}/speaker-identification/voiceprint`,
    form,
    {
      headers: { ...form.getHeaders(), ...authHeaders(organizationId) },
      timeout: COMPUTE_TIMEOUT,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    },
  )
  return resp.data
}

/**
 * Create or replace a speaker voiceprint in a Qdrant collection.
 * @param {string} organizationId
 * @param {string} qdrantCollection - "spkid_{orgId}_{collectionId}"
 * @param {string} speakerRef - "label:{id}" or "user:{id}"
 * @param {{name:string, vector:number[], modelId:string}} body
 */
async function upsertSpeaker(organizationId, qdrantCollection, speakerRef, body) {
  const baseUrl = await resolveServiceBaseUrl()
  await axios.put(
    `${baseUrl}/speaker-identification/collections/${qdrantCollection}/speakers/${encodeSpeakerRef(speakerRef)}`,
    { name: body.name, vector: body.vector, modelId: body.modelId },
    {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(organizationId),
      },
      timeout: UPSERT_TIMEOUT,
    },
  )
}

/**
 * Delete a speaker from a Qdrant collection. Idempotent on the worker side.
 */
async function deleteSpeaker(organizationId, qdrantCollection, speakerRef) {
  const baseUrl = await resolveServiceBaseUrl()
  await axios.delete(
    `${baseUrl}/speaker-identification/collections/${qdrantCollection}/speakers/${encodeSpeakerRef(speakerRef)}`,
    {
      headers: authHeaders(organizationId),
      timeout: DELETE_TIMEOUT,
    },
  )
}

/**
 * Drop a whole Qdrant collection. Idempotent on the worker side.
 */
async function dropCollection(organizationId, qdrantCollection) {
  const baseUrl = await resolveServiceBaseUrl()
  await axios.delete(
    `${baseUrl}/speaker-identification/collections/${qdrantCollection}`,
    {
      headers: authHeaders(organizationId),
      timeout: DROP_TIMEOUT,
    },
  )
}

/**
 * Read the speaker identification capability/model info.
 * @returns {Promise<{enabled:boolean, modelId?:string, dim?:number}>}
 */
async function getInfo(organizationId) {
  try {
    const baseUrl = await resolveServiceBaseUrl()
    const resp = await axios.get(`${baseUrl}/speaker-identification/info`, {
      headers: authHeaders(organizationId),
      timeout: INFO_TIMEOUT,
    })
    return resp.data
  } catch (err) {
    debug("getInfo failed: %s", err.message)
    return { enabled: false }
  }
}

module.exports = {
  resolveServiceBaseUrl,
  resetDiscoveryCache,
  computeVoiceprint,
  upsertSpeaker,
  deleteSpeaker,
  dropCollection,
  getInfo,
}
