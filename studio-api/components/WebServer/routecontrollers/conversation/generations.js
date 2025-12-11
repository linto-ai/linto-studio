const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation:generations`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationMetadataRequire,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

/**
 * List generations for a conversation and service
 * GET /conversations/:conversationId/generations?serviceId=xxx
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

    // Format response
    const formattedGenerations = generations.map((gen) => ({
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
    appLogger.error(`[Generations] listGenerations error: ${error.message}`)
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
    appLogger.error(`[Generations] createGeneration error: ${error.message}`)
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
      return res.status(404).json({
        status: "error",
        error: "Generation not found",
      })
    }

    const gen = generations[0]

    // Verify generation belongs to this conversation
    if (gen.conversationId !== req.params.conversationId) {
      return res.status(404).json({
        status: "error",
        error: "Generation not found for this conversation",
      })
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
    appLogger.error(`[Generations] getGeneration error: ${error.message}`)
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
