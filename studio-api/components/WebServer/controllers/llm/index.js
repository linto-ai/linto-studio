const debug = require("debug")(
  `linto:components:WebServer:controllers:llm:index`,
)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const organizationWsManager = require(
  `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const FormData = require("form-data")

const model = require(`${process.cwd()}/lib/mongodb/models`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

/**
 * Generate plain text from conversation turns
 */
async function generateText(conversation, metadata) {
  let prompt = ""

  conversation.text.map((turn) => {
    if (metadata.speakers) {
      prompt += turn.speaker_name + " : "
    }

    if (conversation.text.indexOf(turn) === conversation.text.length - 1) {
      prompt += turn.segment
      return
    } else {
      prompt += turn.segment + "\n"
    }
  })

  return prompt
}

/**
 * Request LLM processing for a conversation
 * Uses LLM Gateway V2 API with organization-scoped WebSocket
 */
async function request(req, query, conversation, metadata, conversationExport) {
  let content = await generateText(conversation, metadata)
  // Extract organization ID from conversation
  const organizationId = conversation.organization?.organizationId?.toString() || null
  return requestAPIV2(req, query, content, conversationExport, conversation, organizationId)
}

/**
 * LLM Gateway V2 API request
 *
 * Uses the /run endpoint with multipart form data:
 * - POST /api/v1/services/{service_id}/run - Form data with file upload
 *
 * Form fields:
 * - flavor_id (required): UUID string
 * - file (optional): File upload - transcript content
 * - organization_id (optional): LinTO organization ID
 * - temperature (optional): float
 * - top_p (optional): float
 * - context (optional): JSON string for categorization
 *
 * Response: { job_id, status, service_id, service_name, flavor_id, flavor_name, ... }
 */
async function requestAPIV2(req, query, content, conversationExport, conversation, organizationId = null) {
  if (process.env.LLM_GATEWAY_SERVICES === undefined) {
    throw new Error("LLM_GATEWAY_SERVICES is not defined")
  }

  // Set app reference for WebSocket broadcasting (only needed once)
  if (req.app && !organizationWsManager._app) {
    organizationWsManager.setApp(req.app)
  }

  const baseUrl = process.env.LLM_GATEWAY_SERVICES

  // Resolve service by name/route (query.format is the service identifier)
  const serviceId = await resolveServiceId(query.format)
  if (!serviceId) {
    throw new Error(`Service not found: ${query.format}`)
  }

  // Resolve flavor - either by name or use service default
  const flavorId = await resolveFlavorId(serviceId, query.flavor)

  // V2 run endpoint with multipart form data
  const url = `${baseUrl}/api/v1/services/${serviceId}/run`

  // Build form data
  const formData = new FormData()
  formData.append("flavor_id", flavorId)

  // Create file-like object from transcript content
  const transcriptBuffer = Buffer.from(content, "utf-8")
  formData.append("file", transcriptBuffer, {
    filename: "transcript.txt",
    contentType: "text/plain",
  })

  // Pass organization ID to LLM Gateway
  if (organizationId) {
    formData.append("organization_id", organizationId)
  }

  // Add context metadata as JSON string
  const context = {
    conversationId: conversation._id.toString(),
    conversationName: conversation.name,
  }
  formData.append("context", JSON.stringify(context))

  let jobId = undefined
  try {
    const response = await axios.postFormData(url, {
      formData: formData,
      headers: formData.getHeaders(),
    })

    // V2 response format: { job_id, status, service_id, service_name, flavor_id, ... }
    jobId = response.job_id

    // Store additional V2 metadata
    conversationExport.serviceId = response.service_id
    conversationExport.serviceName = response.service_name
    conversationExport.flavorId = response.flavor_id
    conversationExport.flavorName = response.flavor_name
    conversationExport.organizationId = organizationId

    // Handle fallback tracking (V2 feature)
    if (response.fallback_applied) {
      conversationExport.fallbackApplied = true
      conversationExport.originalFlavorName = response.original_flavor_name
      conversationExport.fallbackReason = response.fallback_reason
    }

    appLogger.info(`[LLM V2] Job created: ${jobId} for service ${response.service_name} (org: ${organizationId || "none"})`)
  } catch (err) {
    appLogger.error(`[LLM V2] Request failed: ${err.message}`)
    jobId = undefined
    conversationExport.status = "error"
    conversationExport.error = err.message || "Failed to create LLM job"
    await model.conversationExport.updateStatus(conversationExport)
    throw err
  }

  // Start WebSocket monitoring for the job via organization-scoped connection
  if (jobId && organizationId) {
    conversationExport.jobId = jobId
    // IMPORTANT: Update database immediately so WebSocket lookups can find conversationId
    await model.conversationExport.updateStatus(conversationExport)

    // Ensure organization WebSocket is connected and register callback for this job
    await organizationWsManager.ensureConnection(organizationId, baseUrl)
    organizationWsManager.registerJobCallback(organizationId, jobId, async (update) => {
      await handleJobUpdate(jobId, update)
    })
  } else if (jobId) {
    // Fallback: no organization ID, still register job but with null org
    conversationExport.jobId = jobId
    await model.conversationExport.updateStatus(conversationExport)
    appLogger.warn(`[LLM V2] Job ${jobId} created without organization ID - WebSocket monitoring limited`)
  }

  LogManager.logLlmEvent(req, {
    contentLength: content.length,
    conversationExport: conversationExport,
    query: query,
    jobId: jobId,
    organizationId: organizationId,
  })

  return jobId
}

/**
 * Handle job update from WebSocket
 * Called by OrganizationWebSocketManager when a job_update message arrives
 */
async function handleJobUpdate(jobId, update) {
  try {
    // Find conversation export by job ID
    const convExports = await model.conversationExport.getByJobId(jobId)
    if (!convExports || convExports.length === 0) {
      debug(`No conversation export found for job ${jobId}`)
      return
    }

    const convExport = convExports[0]

    // Map V2 status to internal status
    const statusMap = {
      queued: "queued",
      started: "started",
      processing: "processing",
      completed: "complete",
      failed: "error",
      cancelled: "error",
    }

    convExport.status = statusMap[update.status] || update.status

    // Handle progress (V2 format)
    if (update.progress) {
      convExport.processing = update.progress.percentage || 0
      convExport.progress = {
        current: update.progress.current,
        total: update.progress.total,
        percentage: update.progress.percentage,
        phase: update.progress.phase,
      }
    }

    // Handle result (V2 format - result contains the summarization output)
    // Note: Content is NOT cached locally - fetch from LLM Gateway when needed (single source of truth)
    if (update.status === "completed") {
      convExport.processing = 100
    }

    // Handle error
    if (update.error) {
      convExport.error = update.error
    }

    await model.conversationExport.updateStatus(convExport)
    appLogger.debug(`[LLM V2] Updated conversation export for job ${jobId}`)

    // Also update generation status if a generation record exists for this job
    try {
      const generationStatus = statusMap[update.status] || update.status
      if (generationStatus === "complete" || generationStatus === "error") {
        await model.conversationGenerations.updateStatus(
          jobId,
          generationStatus === "complete" ? "completed" : generationStatus,
          update.error || null
        )
        debug(`Updated generation status for job ${jobId}: ${generationStatus}`)
      }
    } catch (genErr) {
      // Silently ignore if no generation record exists
      debug(`No generation record to update for job ${jobId}`)
    }
  } catch (error) {
    appLogger.error(`[LLM V2] Error handling job update for ${jobId}: ${error.message}`)
  }
}

/**
 * Resolve service ID from service name/route
 * V2 services can be looked up by name
 */
async function resolveServiceId(serviceIdentifier) {
  const baseUrl = process.env.LLM_GATEWAY_SERVICES

  try {
    // Try to find service by name or route
    const response = await axios.get(
      `${baseUrl}/api/v1/services?page=1&page_size=100`
    )

    const services = response.items || []
    const service = services.find(
      (s) =>
        s.name === serviceIdentifier ||
        s.route === serviceIdentifier ||
        s.id === serviceIdentifier
    )

    if (service) {
      return service.id
    }

    // If not found by name, assume it's already an ID
    return serviceIdentifier
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to resolve service: ${err.message}`)
    return serviceIdentifier // Return as-is, let the API handle validation
  }
}

/**
 * Resolve flavor ID from flavor name or return default
 */
async function resolveFlavorId(serviceId, flavorName) {
  const baseUrl = process.env.LLM_GATEWAY_SERVICES

  try {
    // Get service details with flavors
    const response = await axios.get(`${baseUrl}/api/v1/services/${serviceId}`)

    const flavors = response.flavors || []

    // If flavor name provided, find matching flavor
    if (flavorName) {
      const flavor = flavors.find(
        (f) => f.name === flavorName || f.id === flavorName
      )
      if (flavor) {
        return flavor.id
      }
    }

    // Use default flavor
    const defaultFlavor = flavors.find((f) => f.is_default) || flavors[0]
    if (defaultFlavor) {
      return defaultFlavor.id
    }

    return null
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to resolve flavor: ${err.message}`)
    return flavorName // Return as-is
  }
}

/**
 * Initialize WebSocket connection for job monitoring
 * Uses organization-scoped WebSocket connection
 */
async function initWebSocketConnection(convExport) {
  if (convExport && convExport.jobId && convExport.organizationId) {
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    await organizationWsManager.ensureConnection(convExport.organizationId, baseUrl)
    organizationWsManager.registerJobCallback(convExport.organizationId, convExport.jobId, async (update) => {
      await handleJobUpdate(convExport.jobId, update)
    })
  }
}

/**
 * Poll/watch a job via WebSocket
 * Uses organization-scoped WebSocket connection
 */
async function processJobWithWebSocket(jobId, conversationExport) {
  try {
    if (!jobId) {
      throw new Error("Job ID is required")
    }

    const organizationId = conversationExport.organizationId
    if (organizationId) {
      const baseUrl = process.env.LLM_GATEWAY_SERVICES
      await organizationWsManager.ensureConnection(organizationId, baseUrl)
      organizationWsManager.registerJobCallback(organizationId, jobId, async (update) => {
        await handleJobUpdate(jobId, update)
      })
    } else {
      appLogger.warn(`[LLM V2] Cannot monitor job ${jobId} - no organization ID`)
    }
  } catch (err) {
    conversationExport.status = "error"
    conversationExport.error = err.message
    await model.conversationExport.updateStatus(conversationExport)
  }
}

/**
 * Get job status from V2 API
 */
async function getJobStatus(jobId) {
  if (!jobId) return null

  const baseUrl = process.env.LLM_GATEWAY_SERVICES
  try {
    const response = await axios.get(`${baseUrl}/api/v1/jobs/${jobId}`)
    return response
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to get job status: ${err.message}`)
    return null
  }
}

/**
 * Get job result from V2 API
 */
async function getJobResult(jobId) {
  if (!jobId) return null

  const job = await getJobStatus(jobId)
  if (job && job.status === "completed") {
    return job.result
  }
  return null
}

/**
 * Export job result as PDF or DOCX via V2 API
 * V2 endpoint: GET /api/v1/jobs/{job_id}/export/{format}
 * @param {string} jobId - Job ID
 * @param {string} format - Export format (pdf, docx, html)
 * @param {string} templateId - Optional template ID
 * @param {number} versionNumber - Optional version number for per-version export
 */
async function exportJobDocument(jobId, format = "pdf", templateId = null, versionNumber = null) {
  if (!jobId) throw new Error("Job ID is required")

  const baseUrl = process.env.LLM_GATEWAY_SERVICES
  let url = `${baseUrl}/api/v1/jobs/${jobId}/export/${format}`

  // Build query params
  const params = []
  if (templateId) {
    params.push(`template_id=${templateId}`)
  }
  if (versionNumber !== null) {
    params.push(`version_number=${versionNumber}`)
  }
  if (params.length > 0) {
    url += `?${params.join("&")}`
  }

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    })
    return response
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to export document: ${err.message}`)
    throw err
  }
}

/**
 * Cancel a running job via V2 API
 * V2 endpoint: POST /api/v1/jobs/{job_id}/cancel
 */
async function cancelJob(jobId) {
  if (!jobId) throw new Error("Job ID is required")

  const baseUrl = process.env.LLM_GATEWAY_SERVICES
  const url = `${baseUrl}/api/v1/jobs/${jobId}/cancel`

  try {
    const response = await axios.post(url, { data: {} })
    appLogger.info(`[LLM V2] Job cancelled: ${jobId}`)
    return response
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to cancel job: ${err.message}`)
    throw err
  }
}

/**
 * Check if job is in terminal state
 */
function completedJob(job) {
  const terminalStatuses = ["complete", "completed", "error", "failed", "cancelled", "unknown"]
  return terminalStatuses.includes(job.status)
}

/**
 * Get socket status (for backward compatibility)
 */
function getSocketStatus() {
  return organizationWsManager.hasActiveConnections()
}

/**
 * Get the markdown content for a completed job
 * Always fetches from LLM Gateway (single source of truth - no local caching)
 * @param {string} jobId - The job ID
 * @returns {Promise<string|null>} The markdown content or null
 */
async function getJobMarkdownContent(jobId) {
  if (!jobId) return null

  try {
    // Always fetch from LLM Gateway (single source of truth)
    const job = await getJobStatus(jobId)
    if (job && job.status === "completed" && job.result) {
      if (typeof job.result === "object" && job.result.output) {
        return job.result.output
      }
      return typeof job.result === "string" ? job.result : null
    }

    return null
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to get markdown content for job ${jobId}: ${err.message}`)
    return null
  }
}

/**
 * Broadcast LLM job update to WebSocket clients
 * Used by studio-websocket to forward updates to frontend clients
 * @param {string} conversationId - The conversation ID
 * @param {object} update - The job update data
 * @returns {object} Formatted update for WebSocket broadcast
 */
function formatJobUpdateForBroadcast(conversationId, update) {
  return {
    conversationId: conversationId,
    jobId: update.job_id,
    status: update.status,
    progress: update.progress || null,
    result: update.result || null,
    error: update.error || null,
    timestamp: update.timestamp || new Date().toISOString(),
  }
}

/**
 * Register callback for broadcasting job updates to a specific conversation room
 * @param {string} organizationId - Organization ID
 * @param {string} conversationId - Conversation ID
 * @param {string} jobId - Job ID
 * @param {Function} broadcastFn - Function to call with formatted updates
 */
async function registerBroadcastCallback(organizationId, conversationId, jobId, broadcastFn) {
  if (!organizationId || !jobId) {
    appLogger.warn(`[LLM V2] Cannot register broadcast callback: missing organizationId or jobId`)
    return
  }

  const baseUrl = process.env.LLM_GATEWAY_SERVICES
  try {
    await organizationWsManager.ensureConnection(organizationId, baseUrl)
    organizationWsManager.registerJobCallback(organizationId, jobId, async (update) => {
      // Handle the update internally
      await handleJobUpdate(jobId, update)

      // Broadcast to WebSocket clients
      const formattedUpdate = formatJobUpdateForBroadcast(conversationId, update)
      broadcastFn(formattedUpdate)
    })
  } catch (err) {
    appLogger.error(`[LLM V2] Failed to register broadcast callback: ${err.message}`)
  }
}

module.exports = {
  generateText,
  request,
  requestAPIV2,
  pollingLlm: processJobWithWebSocket,
  initWebSocketConnection,
  getSocketStatus,
  getJobStatus,
  getJobResult,
  exportJobDocument,
  cancelJob,
  completedJob,
  getJobMarkdownContent,
  formatJobUpdateForBroadcast,
  registerBroadcastCallback,
}
