const debug = require("debug")(
  `linto:conversation-manager:components:WebServer:controllers:llm:index`,
)
const fs = require("fs")
const FormData = require("form-data")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const WebSocket = require("ws") // Import the WebSocket library

const activeJobs = new Map()
let socket = null
let isSocketConnected = false

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

async function request(query, conversation, metadata, conversationExport) {
  let content = await generateText(conversation, metadata)
  const tempFileName = `file_${query.format}_${conversation._id}.txt`

  return requestAPI(query, content, tempFileName, conversationExport)
}

async function requestAPI(query, content, fileName, conversationExport) {
  if (process.env.LLM_GATEWAY_SERVICES === undefined) {
    throw new Error("LLM_GATEWAY_SERVICES is not defined")
  }

  const fetch = await import("node-fetch")
  let url =
    process.env.LLM_GATEWAY_SERVICES + "/services/" + query.format + "/generate"

  const tempFilePath = "/tmp/" + fileName
  fs.writeFileSync(tempFilePath, content)

  let formData = new FormData()

  formData.append("flavor", query.flavor)
  formData.append("file", fs.createReadStream(tempFilePath), {
    filename: fileName,
    contentType: "text/plain",
  })

  let options = {
    method: "POST",
    headers: {
      ...formData.getHeaders(),
    },
    body: formData,
  }
  options.formData = formData

  let jobId = undefined
  try {
    const response = await fetch.default(url, options)
    const result = await response.json()
    jobId = result.jobId
  } catch (err) {
    jobId = undefined
    conversationExport.status = "error"
    model.conversationExport.updateStatus(conversationExport)
  }

  fs.unlinkSync(tempFilePath)

  if (isSocketConnected) {
    initWebSocketConnection()
  }
  if (jobId !== undefined) {
    processJobWithWebSocket(jobId, conversationExport)
  }
  return jobId
}

function updateStatus(conversationExport, data) {
  let status = data.status
  conversationExport.status = status

  if (status === "complete" && data.message === "success") {
    conversationExport.data = data.summarization
    conversationExport.processing = "Processing 100%"
  } else if (status === "error" || status === "unknown") {
    conversationExport.data = data.message
  } else if (
    status === "queued" ||
    status === "processing" ||
    status === "started" ||
    status === "progress"
  ) {
    conversationExport.processing = data.message + " " + data.progress
  }
  model.conversationExport.updateStatus(conversationExport)
}

// Function to initialize or reuse the WebSocket connection
function initWebSocketConnection() {
  if (socket && isSocketConnected) return
  if (!process.env.LLM_GATEWAY_SERVICES_WS) {
    throw new Error("LLM_GATEWAY_SERVICES_WS is not defined")
  }
  socket = new WebSocket(process.env.LLM_GATEWAY_SERVICES_WS)

  socket.on("connect", () => {
    isSocketConnected = true
  })

  socket.onerror = (err) => {
    isSocketConnected = false
  }

  socket.onmessage = (message) => {
    try {
      const result = JSON.parse(message.data)
      const jobsId = result.task_id

      if (!activeJobs.has(jobsId)) {
        return
      }

      const conversationExport = activeJobs.get(jobsId)
      updateStatus(conversationExport, result)

      if (["complete", "error", "nojob"].includes(result.status)) {
        activeJobs.delete(jobsId)

        if (activeJobs.size === 0) {
          isSocketConnected = false
          socket.close()
        }
      }
    } catch (err) {
      debug(`Error processing WebSocket message: ${err.message}`)
    }
  }
  socket.onerror = (err) => {
    debug(`WebSocket error: ${err.message}`)
  }
}

// Function to add a job and manage the WebSocket lifecycle
async function processJobWithWebSocket(jobsId, conversationExport) {
  try {
    if (!jobsId) {
      throw new Error("Job ID is required")
    }
    if (activeJobs.has(jobsId)) return
    if (jobsId !== null) activeJobs.set(jobsId, conversationExport)
    initWebSocketConnection()
  } catch (err) {
    conversationExport.status = "error"
    conversationExport.error = err.message
    model.conversationExport.updateStatus(conversationExport)
    activeJobs.delete(jobsId)
    if (activeJobs.size === 0) {
      isSocketConnected = false
      socket.close()
    }
  }
}

module.exports = {
  generateText,
  request,
  pollingLlm: processJobWithWebSocket,
}
