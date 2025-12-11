const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:routeControllers:conversation`,
)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const organizationWsManager = require(
  `${process.cwd()}/components/WebServer/controllers/llm/llm_ws`,
)
const docx = require(
  `${process.cwd()}/components/WebServer/controllers/export/docx`,
)
const llm = require(
  `${process.cwd()}/components/WebServer/controllers/llm/index`,
)
const TYPE = require(`${process.cwd()}/lib/dao/organization/categoryType`)
const { exec } = require("child_process")
const path = require("path")
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const { jsonToPlainText } = require("json-to-plain-text")
const axios = require(`${process.cwd()}/lib/utility/axios`)

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationMetadataRequire,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

async function listExport(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    let conversationExport = await model.conversationExport.getByConvAndFormat(
      req.params.conversationId,
    )
    if (conversationExport.length === 0) {
      return []
    }

    let list = []
    let done = true
    for (let status of conversationExport) {
      let export_conv = {
        _id: status._id.toString(),
        format: status.format,
        status: status.status,
        jobId: status.jobId,
        processing: status.processing,
        last_update: status.last_update,
        // V2 additional fields
        serviceName: status.serviceName,
        flavorName: status.flavorName,
        tokenMetrics: status.tokenMetrics,
        organizationId: status.organizationId,
      }
      if (!["complete", "error", "unknown"].includes(status.status))
        done = false
      if (status.status === "error") export_conv.error = status.error
      list.push(export_conv)
    }
    if (!done) {
      // V2: Connect to organization-scoped WebSocket for monitoring
      // Group pending jobs by organization
      const jobsByOrg = new Map()
      for (const convExport of conversationExport) {
        if (
          convExport.status === "complete" ||
          convExport.status === "error" ||
          convExport.status === "unknown"
        )
          continue
        if (!convExport.jobId || !convExport.organizationId) continue

        if (!jobsByOrg.has(convExport.organizationId)) {
          jobsByOrg.set(convExport.organizationId, [])
        }
        jobsByOrg.get(convExport.organizationId).push(convExport)
      }

      // Watch jobs via organization-scoped WebSocket connections
      const baseUrl = process.env.LLM_GATEWAY_SERVICES
      for (const [organizationId, exports] of jobsByOrg) {
        try {
          await organizationWsManager.ensureConnection(organizationId, baseUrl)
          for (const convExport of exports) {
            organizationWsManager.registerJobCallback(
              organizationId,
              convExport.jobId,
              async (update) => {
                await llm.pollingLlm(convExport.jobId, convExport)
              }
            )
          }
        } catch (err) {
          appLogger.warn(`[Export] Failed to connect WebSocket for org ${organizationId}: ${err.message}`)
        }
      }
    }

    res.status(200).send(list)
  } catch (error) {
    next(error)
  }
}

async function exportConversation(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    if (!req.query.format)
      throw new ConversationMetadataRequire("format is required")

    let conversation = await model.conversations.getById(
      req.params.conversationId,
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    conversation = conversation[0]

    let metadata = {}
    metadata = await prepateData(conversation, metadata, req.query.format)
    if (req.body) {
      if (req.body.filter)
        conversation = await prepareConversation(conversation, req.body.filter)
      if (conversation.text.length === 0) {
        res.status(204).send()
        return
      }

      if (req.body.metadata)
        metadata = await prepareMetadata(
          conversation,
          req.body.metadata,
          metadata,
        )
    }
    switch (req.query.format) {
      case "json":
        await handleJsonFormat(res, metadata, conversation)
        break
      case "text":
        await handleTextFormat(res, metadata, conversation)
        break
      case "odt":
      case "docx":
      case "verbatim":
        await handleVerbatimFormat(res, req.query, conversation, metadata)
        break
      default:
        await handleLLMService(req, res, req.query, conversation, metadata)
    }
  } catch (err) {
    next(err)
  }
}

/**
 * Call LLM API and handle response/errors synchronously
 * Returns { success: true, jobId: string } or { success: false, error: string }
 */
async function callLlmAPI(
  req,
  query,
  conversation,
  metadata,
  conversationExport,
  generationPayload = null,
) {
  try {
    const jobId = await llm.request(req, query, conversation, metadata, conversationExport)

    conversationExport.jobId = jobId
    conversationExport.status = "processing"
    await model.conversationExport.update(conversationExport)

    // Create generation record if payload provided
    if (generationPayload) {
      generationPayload.jobId = jobId
      generationPayload.status = "processing"
      try {
        await model.conversationGenerations.create(generationPayload)
        debug(`Created generation record for jobId: ${jobId}`)
      } catch (err) {
        appLogger.warn(`[Export] Failed to create generation record: ${err.message}`)
      }
    }

    return { success: true, jobId }
  } catch (err) {
    appLogger.error(`[Export] LLM API call failed: ${err.message}`)
    conversationExport.status = "error"
    conversationExport.error = err.message
    await model.conversationExport.update(conversationExport)

    // Update generation record if payload provided
    if (generationPayload && generationPayload.generationId) {
      try {
        await model.conversationGenerations.updateStatus(
          generationPayload.jobId,
          "error",
          err.message
        )
      } catch (genErr) {
        appLogger.warn(`[Export] Failed to update generation status: ${genErr.message}`)
      }
    }

    return { success: false, error: err.message }
  }
}

async function handleLLMService(req, res, query, conversation, metadata) {
  try {
    // V2: flavor is optional - service has default flavor
    let conversationExport = await model.conversationExport.getByConvAndFormat(
      conversation._id,
      query.format,
    )

    // Extract organization ID from conversation
    const organizationId = conversation.organization?.organizationId?.toString() || null

    // Service ID is the format (route) which identifies the LLM service
    const serviceId = query.format

    if (query.regenerate === "true" || conversationExport.length === 0) {
      // Archive existing generations for this conversation+service before creating new one
      if (query.regenerate === "true") {
        try {
          await model.conversationGenerations.archiveAllGenerations(
            conversation._id.toString(),
            serviceId
          )
          debug(`Archived existing generations for conversation ${conversation._id} and service ${serviceId}`)
        } catch (archiveErr) {
          appLogger.warn(`[Export] Failed to archive generations: ${archiveErr.message}`)
        }
      }

      // Delete existing export if regenerating
      if (conversationExport.length !== 0)
        await model.conversationExport.delete(conversationExport[0]._id)

      // Create new export record
      conversationExport = {
        convId: conversation._id.toString(),
        format: query.format,
        llmOutputType: query.llmOutputType || "abstractive",
        status: "processing",
        processing: 0,
        // V2 additional fields
        serviceName: null,
        flavorName: null,
        organizationId: organizationId,
      }
      const exportResult = await model.conversationExport.create(conversationExport)
      conversationExport._id = exportResult.insertedId.toString()

      // Prepare generation payload for tracking history
      const generationPayload = {
        conversationId: conversation._id.toString(),
        serviceId: serviceId,
        serviceName: query.title || serviceId, // Use title if provided, otherwise service ID
        organizationId: organizationId,
        isCurrent: true,
      }

      // V2: Call LLM API with generation payload (awaited for proper error handling)
      const result = await callLlmAPI(req, query, conversation, metadata, conversationExport, generationPayload)

      if (result.success) {
        res.status(200).send({ status: "processing", processing: 0, organizationId: organizationId })
      } else {
        // Return error immediately so frontend can show notification
        res.status(502).send({
          status: "error",
          error: result.error || "Failed to connect to LLM Gateway",
          errorType: "llm_gateway_error"
        })
      }
    } else if (
      conversationExport[0].status === "done" ||
      conversationExport[0].status === "complete"
    ) {
      conversationExport = conversationExport[0]

      // V2: Check if document export is requested (preview=true or exportFormat specified)
      if (query.preview === "true" || query.exportFormat === "pdf" || query.exportFormat === "docx") {
        // Try V2 document export from LLM Gateway
        const exportResult = await handleV2DocumentExport(res, conversationExport, query, conversation.name)

        // If job was not found on LLM Gateway, inform frontend to regenerate
        if (exportResult?.jobNotFound) {
          res.status(410).send({
            status: "job_not_found",
            error: "Job no longer exists on LLM Gateway",
            requiresRegeneration: true,
          })
        }
      } else if (conversationExport.llmOutputType === "markdown" || conversationExport.llmOutputType === "text") {
        // Return raw text content for editing (markdown or text output types)
        // First verify the job still exists if we don't have local data
        if (!conversationExport.data && conversationExport.jobId) {
          const jobExists = await verifyJobExists(conversationExport.jobId)
          if (!jobExists) {
            conversationExport.status = "unknown"
            conversationExport.error = "Job not found on LLM Gateway - regeneration required"
            await model.conversationExport.update(conversationExport)
            res.status(410).send({
              status: "job_not_found",
              error: "Job no longer exists on LLM Gateway",
              requiresRegeneration: true,
            })
            return
          }
        }
        handleTextContent(
          res,
          conversationExport,
          conversation.name,
        )
      } else {
        // Fallback to local DOCX generation
        const file = await docx.generateDocxOnFormat(query, conversationExport)
        sendFileAsResponse(res, file, query)
      }
    } else {
      if (
        conversationExport[0].status === "unknown" ||
        (conversationExport[0].status === "error" &&
          conversationExport[0].error)
      ) {
        res.status(400).send({
          status: conversationExport[0].status,
          error: conversationExport[0].error,
        })
      } else {
        // V2: Connect to WebSocket for job monitoring
        llm.pollingLlm(conversationExport[0].jobId, conversationExport[0])
        res.status(200).send({
          status: conversationExport[0].status,
          processing: conversationExport[0].processing,
          // V2 additional fields
          serviceName: conversationExport[0].serviceName,
          flavorName: conversationExport[0].flavorName,
        })
      }
    }
  } catch (err) {
    throw err
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
    appLogger.warn(`[Export] Error verifying job ${jobId}: ${err.message}`)
    return true
  }
}

/**
 * Handle V2 document export (PDF/DOCX) from LLM Gateway
 * Falls back to local generation if V2 export fails
 * Returns { jobNotFound: true } if job no longer exists on LLM Gateway
 */
async function handleV2DocumentExport(res, conversationExport, query, conversationName) {
  const jobId = conversationExport.jobId

  // Determine format (pdf for preview, otherwise use exportFormat or default to docx)
  let format = query.exportFormat || "docx"
  if (query.preview === "true") {
    format = "pdf"
  }

  try {
    if (jobId && process.env.LLM_GATEWAY_SERVICES) {
      // V2: Export document directly from LLM Gateway
      const documentBuffer = await llm.exportJobDocument(jobId, format)

      const validCharsRegex = /[a-zA-Z0-9-_.]/g
      const fileName = conversationName.match(validCharsRegex).join("") + "." + format

      if (format === "pdf") {
        res.setHeader("Content-Type", "application/pdf")
      } else {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      }
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
      res.send(Buffer.from(documentBuffer))
      return { success: true }
    }
  } catch (err) {
    // Check if this is a 404 (job not found) error
    const isJobNotFound = err.response?.status === 404 ||
      err.message?.includes("not found") ||
      err.message?.includes("404")

    if (isJobNotFound) {
      appLogger.warn(`[Export V2] Job ${jobId} not found on LLM Gateway, marking for regeneration`)
      // Mark the local export as needing regeneration
      conversationExport.status = "unknown"
      conversationExport.error = "Job not found on LLM Gateway - regeneration required"
      await model.conversationExport.update(conversationExport)
      return { jobNotFound: true }
    }

    appLogger.warn(`[Export V2] LLM Gateway export failed, falling back to local generation: ${err.message}`)
  }

  // Fallback: Local DOCX generation (only if we have local data)
  if (conversationExport.data) {
    const file = await docx.generateDocxOnFormat(query, conversationExport)
    sendFileAsResponse(res, file, query)
    return { success: true }
  }

  // No local data and LLM Gateway failed - return job not found
  return { jobNotFound: true }
}
function convertDocxToOdt(docxPath, outputDir, callback) {
  exec(
    `libreoffice --headless --convert-to odt --outdir ${outputDir} ${docxPath}`,
    (err, stdout, stderr) => {
      if (err) return callback(err)
      const odtPath = path.join(
        outputDir,
        path.basename(docxPath, ".docx") + ".odt",
      )
      callback(null, odtPath)
    },
  )
}
async function sendFileAsResponse(res, file, query) {
  const validCharsRegex = /[a-zA-Z0-9-_.]/g
  let fileName = file.name.match(validCharsRegex).join("")

  if (query.preview === undefined) query.preview = "false"
  if (query.exportFormat === undefined) query.exportFormat = "docx"

  if (query.preview === "true") {
    const pdf = await docx.convertToPDF(file)
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-disposition", "attachment; filename=" + fileName)
    res.sendFile(pdf.path)
  } else if (query.exportFormat === "odt") {
    await convertDocxToOdt(file.path, "/tmp", (err, odtPath) => {
      if (err) return res.status(500).send("ODT Conversion failed")

      res.setHeader("Content-Type", "application/vnd.oasis.opendocument.text")
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${path.basename(odtPath)}`,
      )
      res.sendFile(odtPath)
    })
  } else {
    res.setHeader("Content-Type", "application/vnd.openxmlformats")
    res.setHeader("Content-disposition", "attachment; filename=" + fileName)
    res.sendFile(file.path)
  }
}

async function handleJsonFormat(res, metadata, conversation) {
  let output = {
    metadata: metadata,
    text: conversation.text,
  }

  //we don't add metadata if json is empty
  if (Object.keys(metadata).length === 0) delete output.metadata

  res.setHeader("Content-Type", "application/json")
  res.status(200).send(output)
}

async function handleMarkdownFormat(
  res,
  conversationExport,
  name,
  preview = "false",
) {
  res.setHeader("Content-Type", "text/plain")
  res.status(200).send("# " + name + "\n" + conversationExport.data)
}

/**
 * Handle text/markdown content - returns raw text for frontend editor
 */
async function handleTextContent(res, conversationExport, name) {
  const content = conversationExport.data || ""
  res.setHeader("Content-Type", "text/plain")
  res.status(200).send(content)
}

async function handleTextFormat(res, metadata, conversation) {
  let output = jsonToPlainText(metadata, {
    color: false,
  })

  output += "\n\n"
  conversation.text.map((text) => {
    if (metadata.speakers) output += `${text.speaker_name} : `
    if (text.stime) output += `${text.stime} - ${text.etime} : `
    output += text.segment + "\n\n"
  })

  res.setHeader("Content-Type", "text/plain")
  res.status(200).send(output)
}

async function handleVerbatimFormat(res, query, conversation, metadata) {
  const text = await llm.generateText(conversation, metadata)
  const conv = {
    data: text,
    status: "done",
    convId: conversation._id,
    format: query.format,
    created: conversation.created,
  }
  const file = await docx.generateDocxOnFormat(query, conv)
  sendFileAsResponse(res, file, query)
}

async function prepareConversation(conversation, filter) {
  if (filter.speaker)
    conversation.text = conversation.text.filter((turn) =>
      filter.speaker.includes(turn.speaker_id),
    )

  if (filter.keyword) {
    let keyword_list = filter.keyword.split(",")
    keyword_list = (await model.tags.getByIdList(keyword_list)).map(
      (tag) => tag.name,
    )
    conversation.text = conversation.text.filter((turn) =>
      keyword_list.some((keyword) =>
        turn.segment.toLowerCase().includes(keyword),
      ),
    )
  }
  return conversation
}

async function prepateData(conversation, data, format) {
  data.title = conversation.name
  if (conversation.description) data.description = conversation.description

  let speakers = {}

  data.speakers = []
  conversation.speakers.map((speaker) => {
    speakers[speaker.speaker_id] = speaker.speaker_name
    data.speakers.push(speaker.speaker_name)
  })

  let secondsDecimals = 2
  if (format === "docx") secondsDecimals = 0

  let text = conversation.text
    .map((turn) => {
      try {
        let stime, etime
        if (turn.stime) stime = turn.stime
        else stime = turn.words[0].stime

        if (turn.etime) etime = turn.etime
        else etime = turn.words[turn.words.length - 1].etime

        let update_turn = {
          turn_id: turn.turn_id,
          segment: turn.segment,
        }
        update_turn.speaker_id = turn.speaker_id
        update_turn.speaker_name = speakers[turn.speaker_id]
        update_turn.stime = secondsToHHMMSSWithDecimals(stime, secondsDecimals)
        update_turn.etime = secondsToHHMMSSWithDecimals(etime, secondsDecimals)
        return update_turn
      } catch (err) {
        // Skip malformed turn entry
      }
    })
    .filter(Boolean) // remove undefined entries in case of something is unsupported or unexpected

  conversation.text = text
  return data
}

async function prepareMetadata(conversation, metadata, data) {
  if (metadata.tags !== false || metadata.keyword !== false) {
    data.categories = {}

    let conv_tag = await model.tags.getByIdList(conversation.tags)
    for (let tag of conv_tag) {
      let category = await model.categories.getById(tag.categoryId)
      if (!category) continue

      category = category[0]
      if (category.type === TYPE.HIGHLIGHT && metadata.keyword === false)
        continue
      if (category.type === TYPE.LABEL && metadata.tags === false) continue

      if (!data.categories[category.name])
        data.categories[category.name] = { type: category.type, tags: [] }

      data.categories[category.name].tags.push(tag.name)
    }
    if (Object.keys(data.categories).length === 0) delete data.categories
  }

  return data
}

function secondsToHHMMSSWithDecimals(totalSeconds, secondsDecimals = 0) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = (totalSeconds % 60).toFixed(secondsDecimals)

  if (hours === 0) return `${minutes.toString().padStart(2, "0")}:${seconds}`
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds}`
}

/**
 * Update job result - proxy to LLM Gateway
 * PUT /conversations/:conversationId/export/:jobId/result
 * Body: { content: string }
 */
async function updateExportResult(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const { jobId } = req.params
    const { content } = req.body

    if (!jobId) throw new ConversationMetadataRequire("jobId is required")
    if (!content) throw new ConversationMetadataRequire("content is required")

    // Proxy to LLM Gateway
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    const response = await axios.patch(`${baseUrl}/api/v1/jobs/${jobId}/result`, { content })

    // Update local conversationExport with new version number
    const conversationExport = await model.conversationExport.getByJobId(jobId)
    if (conversationExport && conversationExport.length > 0 && response.current_version) {
      conversationExport[0].currentVersion = response.current_version
      await model.conversationExport.update(conversationExport[0])
    }

    return res.status(200).json({
      status: "success",
      jobId,
      version: response.current_version || 1
    })
  } catch (err) {
    appLogger.error(`[Export] updateExportResult error: ${err.message}`)
    return res.status(err.response?.status || 500).json({
      status: "error",
      error: err.response?.data?.detail || err.message
    })
  }
}

/**
 * List all versions for a job - proxy to LLM Gateway
 * GET /conversations/:conversationId/export/:jobId/versions
 */
async function listExportVersions(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const { jobId } = req.params

    if (!jobId) throw new ConversationMetadataRequire("jobId is required")

    // Proxy to LLM Gateway
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    const response = await axios.get(`${baseUrl}/api/v1/jobs/${jobId}/versions`)

    return res.status(200).json({
      status: "success",
      versions: response || []
    })
  } catch (err) {
    appLogger.error(`[Export] listExportVersions error: ${err.message}`)
    return res.status(err.response?.status || 500).json({
      status: "error",
      error: err.response?.data?.detail || err.message
    })
  }
}

/**
 * Get a specific version - proxy to LLM Gateway
 * GET /conversations/:conversationId/export/:jobId/versions/:versionNumber
 */
async function getExportVersion(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const { jobId, versionNumber } = req.params

    if (!jobId) throw new ConversationMetadataRequire("jobId is required")
    if (!versionNumber) throw new ConversationMetadataRequire("versionNumber is required")

    // Proxy to LLM Gateway
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    const response = await axios.get(`${baseUrl}/api/v1/jobs/${jobId}/versions/${versionNumber}`)

    return res.status(200).json({
      status: "success",
      version: response
    })
  } catch (err) {
    appLogger.error(`[Export] getExportVersion error: ${err.message}`)
    return res.status(err.response?.status || 500).json({
      status: "error",
      error: err.response?.data?.detail || err.message
    })
  }
}

/**
 * Restore a specific version - proxy to LLM Gateway
 * POST /conversations/:conversationId/export/:jobId/versions/:versionNumber/restore
 */
async function restoreExportVersion(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const { jobId, versionNumber } = req.params

    if (!jobId) throw new ConversationMetadataRequire("jobId is required")
    if (!versionNumber) throw new ConversationMetadataRequire("versionNumber is required")

    // Proxy to LLM Gateway
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    const response = await axios.post(`${baseUrl}/api/v1/jobs/${jobId}/versions/${versionNumber}/restore`, {})

    // Update local conversationExport
    const conversationExport = await model.conversationExport.getByJobId(jobId)
    if (conversationExport && conversationExport.length > 0 && response.current_version) {
      conversationExport[0].currentVersion = response.current_version
      // Also update local data if result is available
      if (response.result?.output) {
        conversationExport[0].data = response.result.output
      }
      await model.conversationExport.update(conversationExport[0])
    }

    return res.status(200).json({
      status: "success",
      version: response.current_version,
      content: response.result?.output || null
    })
  } catch (err) {
    appLogger.error(`[Export] restoreExportVersion error: ${err.message}`)
    return res.status(err.response?.status || 500).json({
      status: "error",
      error: err.response?.data?.detail || err.message
    })
  }
}

/**
 * Generate document (PDF/DOCX) from job result
 * POST /conversations/:conversationId/export/:jobId/document
 * Body: { format: "pdf" | "docx", versionNumber?: number }
 *
 * If versionNumber is provided, exports that specific version (with per-version extraction).
 * Otherwise, exports the current job version.
 */
async function generateExportDocument(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const { jobId } = req.params
    const { format, versionNumber } = req.body

    if (!jobId) throw new ConversationMetadataRequire("jobId is required")
    if (!format || !["pdf", "docx"].includes(format)) {
      throw new ConversationMetadataRequire("format must be 'pdf' or 'docx'")
    }

    // Get conversation for filename
    const conversation = await model.conversations.getById(req.params.conversationId)
    const conversationName = conversation && conversation.length > 0 ? conversation[0].name : "export"
    const validCharsRegex = /[a-zA-Z0-9-_.]/g
    const fileName = conversationName.match(validCharsRegex)?.join("") || "export"

    // Proxy to LLM Gateway with optional version_number
    const baseUrl = process.env.LLM_GATEWAY_SERVICES
    if (!baseUrl) {
      return res.status(500).json({ status: "error", error: "LLM Gateway not configured" })
    }

    let url = `${baseUrl}/api/v1/jobs/${jobId}/export/${format}`
    if (versionNumber !== undefined && versionNumber !== null) {
      url += `?version_number=${versionNumber}`
      appLogger.info(`[Export] Exporting version ${versionNumber} for job ${jobId}`)
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer"
    })

    if (format === "pdf") {
      res.setHeader("Content-Type", "application/pdf")
    } else {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    }
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}.${format}"`)
    res.send(Buffer.from(response))
  } catch (err) {
    appLogger.error(`[Export] generateExportDocument error: ${err.message}`)
    return res.status(err.response?.status || 500).json({
      status: "error",
      error: err.response?.data?.detail || err.message
    })
  }
}

module.exports = {
  exportConversation,
  listExport,
  updateExportResult,
  listExportVersions,
  getExportVersion,
  restoreExportVersion,
  generateExportDocument,
}
