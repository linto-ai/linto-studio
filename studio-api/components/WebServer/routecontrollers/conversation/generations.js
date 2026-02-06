const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:conversation:generations`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)
const llm = require(
  `${process.cwd()}/components/WebServer/controllers/llm/index`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationMetadataRequire,
  GenerationNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

const HEALTH_CHECK_TIMEOUT = 5000 // 5 seconds

/**
 * Check if LLM Gateway is healthy
 * @returns {Promise<boolean>} true if gateway is reachable and healthy
 */
async function checkLlmGatewayHealth() {
  const baseUrl = process.env.LLM_GATEWAY_SERVICES
  if (!baseUrl) return false

  try {
    const response = await axios.get(`${baseUrl}/healthcheck`, {
      timeout: HEALTH_CHECK_TIMEOUT
    })
    return response?.status === "healthy"
  } catch (err) {
    appLogger.warn(`[Generations] Health check failed: ${err.message}`)
    return false
  }
}

/**
 * Verify if a job still exists on LLM Gateway
 * @param {string} jobId - The job ID to verify
 * @returns {Promise<boolean>} True if job exists, false otherwise
 */
async function verifyJobExists(jobId) {
  if (!jobId || !process.env.LLM_GATEWAY_SERVICES) return false

  try {
    const jobStatus = await llm.getJobStatus(jobId)
    return jobStatus !== null
  } catch (err) {
    if (err.response?.status === 404) {
      return false
    }
    // For other errors, assume job might exist
    appLogger.warn(`[Generations] Error verifying job ${jobId}: ${err.message}`)
    return true
  }
}

/**
 * List generations for a conversation and service
 * GET /conversations/:conversationId/generations?serviceId=xxx
 *
 * Validates each completed generation against LLM Gateway and filters out orphans.
 */
async function listGenerations(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { serviceId } = req.query
    if (!serviceId) {
      throw new ConversationMetadataRequire("serviceId query parameter is required")
    }

    // Verify conversation exists
    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    // Get generations for this conversation and service
    const generations = await model.conversationGenerations.listByConversationAndService(
      req.params.conversationId,
      serviceId
    )

    // Validate completed generations against LLM Gateway and filter out orphans
    const validGenerations = []
    for (const gen of generations) {
      // Only validate completed jobs with jobId
      if (gen.status === "completed" && gen.jobId) {
        const jobExists = await verifyJobExists(gen.jobId)
        if (!jobExists) {
          // Check gateway health before deleting orphan
          const gatewayHealthy = await checkLlmGatewayHealth()
          if (gatewayHealthy) {
            // Job no longer exists on gateway - delete orphan reference
            appLogger.info(`[Generations] Removing orphan generation for job ${gen.jobId}`)
            await model.conversationGenerations.delete(gen._id)
            continue // Skip this generation
          }
          // Gateway unhealthy - keep reference, include in list
        }
      }
      validGenerations.push(gen)
    }

    // Format response
    const formattedGenerations = validGenerations.map((gen) => ({
      generationId: gen.generationId,
      jobId: gen.jobId,
      createdAt: gen.createdAt,
      serviceId: gen.serviceId,
      serviceName: gen.serviceName || "",
      status: gen.status,
      isCurrent: gen.isCurrent,
    }))

    res.status(200).send({ generations: formattedGenerations })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a new generation record
 * POST /conversations/:conversationId/generations
 * Body: { serviceId: string, jobId: string, serviceName?: string }
 */
async function createGeneration(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { serviceId, jobId, serviceName } = req.body

    if (!serviceId) {
      throw new ConversationMetadataRequire("serviceId is required")
    }
    if (!jobId) {
      throw new ConversationMetadataRequire("jobId is required")
    }

    // Verify conversation exists
    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    const conversationData = conversation[0]
    const organizationId = conversationData.organization?.organizationId?.toString() || null

    // Archive all previous current generations for this conversation/service
    await model.conversationGenerations.archiveAllGenerations(
      req.params.conversationId,
      serviceId
    )

    // Create new generation record
    const generationData = {
      conversationId: req.params.conversationId,
      serviceId: serviceId,
      serviceName: serviceName || "",
      jobId: jobId,
      status: "pending",
      isCurrent: true,
      organizationId: organizationId,
    }

    const result = await model.conversationGenerations.create(generationData)

    // Format response
    const newGeneration = {
      generationId: generationData.generationId,
      jobId: generationData.jobId,
      createdAt: generationData.createdAt,
      serviceId: generationData.serviceId,
      serviceName: generationData.serviceName,
      status: generationData.status,
      isCurrent: generationData.isCurrent,
    }

    res.status(201).send({ generation: newGeneration })
  } catch (error) {
    next(error)
  }
}

/**
 * Get a specific generation by ID
 * GET /conversations/:conversationId/generations/:generationId
 */
async function getGeneration(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()

    const { generationId } = req.params
    if (!generationId) {
      throw new ConversationMetadataRequire("generationId is required")
    }

    // Verify conversation exists
    const conversation = await model.conversations.getById(req.params.conversationId)
    if (conversation.length !== 1) throw new ConversationNotFound()

    // Get generation
    const generations = await model.conversationGenerations.getByGenerationId(generationId)
    if (generations.length === 0) {
      throw new GenerationNotFound()
    }

    const gen = generations[0]

    // Verify generation belongs to this conversation
    if (gen.conversationId !== req.params.conversationId) {
      throw new GenerationNotFound("Generation not found for this conversation")
    }

    // Format response
    const formattedGeneration = {
      generationId: gen.generationId,
      jobId: gen.jobId,
      createdAt: gen.createdAt,
      serviceId: gen.serviceId,
      serviceName: gen.serviceName || "",
      status: gen.status,
      isCurrent: gen.isCurrent,
    }

    res.status(200).send({ generation: formattedGeneration })
  } catch (error) {
    next(error)
  }
}

/**
 * Update generation status (internal use, called when job status changes)
 * Can be used to sync status from LLM Gateway job updates
 */
async function updateGenerationStatus(jobId, status, error = null) {
  try {
    return await model.conversationGenerations.updateStatus(jobId, status, error)
  } catch (err) {
    appLogger.error(`[Generations] updateGenerationStatus error: ${err.message}`)
    throw err
  }
}

module.exports = {
  listGenerations,
  createGeneration,
  getGeneration,
  updateGenerationStatus,
}
