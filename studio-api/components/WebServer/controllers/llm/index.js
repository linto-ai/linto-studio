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
    initWebSocketConnection(conversationExport)
  } else if (jobId !== undefined) {
    processJobWithWebSocket(jobId, conversationExport)
  }
  return jobId
}

function updateStatus(conversationExport, data) {
  let status = data.status
  conversationExport.status = status

  if (status === "complete" && data.message === "success") {
    conversationExport.data = data.summarization
    conversationExport.processing = data.progress || 100
  } else if (status === "error" || status === "unknown") {
    conversationExport.data = data.error || data.message
  } else if (
    status === "queued" ||
    status === "processing" ||
    status === "started" ||
    status === "progress"
  ) {
    conversationExport.processing = data.progress
  }
  model.conversationExport.updateStatus(conversationExport)
}

// Function to initialize or reuse the WebSocket connection
async function initWebSocketConnection(convExport) {
  if (socket && isSocketConnected) return
  if (!process.env.LLM_GATEWAY_SERVICES_WS) {
    throw new Error("LLM_GATEWAY_SERVICES_WS is not defined")
  }
  let conversationExport = await model.conversationExport.getByConvAndFormat(
    convExport.convId,
  )

  //we filter the conversationExport to get the one who are not completed or in error and we reduce the object to only the jobId
  const currentJobs = conversationExport
    .filter((convExport) => !completedJob(convExport))
    .filter((convExport) => convExport.jobId)
    .map((convExport) => convExport.jobId)

  if (convExport.status !== "complete") currentJobs.push(convExport.jobId)
  if (currentJobs.length === 0) return // No job to track
  const uniqueJobs = [...new Set(currentJobs)]

  socket = new WebSocket(process.env.LLM_GATEWAY_SERVICES_WS)

  socket.on("open", () => {
    if (socket.readyState === 1) {
      isSocketConnected = true
      socket.send(JSON.stringify(uniqueJobs))
    }
  })

  socket.on("connect", () => {})

  socket.onmessage = async (message) => {
    try {
      const result = JSON.parse(message.data)
      if (Array.isArray(result)) {
        let convId = ""
        for (const element of result) {
          let convExport = await model.conversationExport.getByJobId(
            element.task_id,
          )
          if (completedJob(element) && !completedJob(convExport)) {
            updateStatus(convExport[0], element)
            convId = convExport[0].convId
          } else if (
            convExport.length !== 0 ||
            !activeJobs.has(element.task_id)
          ) {
            activeJobs.set(element.task_id, convExport[0])
          }
        }
      } else {
        const jobsId = result.task_id

        if (!activeJobs.has(jobsId)) {
          return
        }
        const conversationExport = activeJobs.get(jobsId)
        updateStatus(conversationExport, result)

        // Should notify for the long polling
        if (completedJob(result)) {
          activeJobs.delete(jobsId)

          if (activeJobs.size === 0) {
            isSocketConnected = false
            if (socket && socket.readyState === WebSocket.OPEN) socket.close()
          }
        }
      }
    } catch (err) {
      debug(`Error processing WebSocket message: ${err.message}`)
    }
  }

  socket.on("error", (err) => {
    isSocketConnected = false
    console.error("WebSocket error:", err)
  })
}

// Function to add a job and manage the WebSocket lifecycle
async function processJobWithWebSocket(jobsId, conversationExport) {
  try {
    if (!jobsId) {
      throw new Error("Job ID is required")
    }
    if (activeJobs.has(jobsId)) return
    if (jobsId !== null) activeJobs.set(jobsId, conversationExport)
    initWebSocketConnection(conversationExport)
  } catch (err) {
    conversationExport.status = "error"
    conversationExport.error = err.message
    model.conversationExport.updateStatus(conversationExport)
    activeJobs.delete(jobsId)
    if (activeJobs.size === 0) {
      isSocketConnected = false
      if (socket && socket.readyState === WebSocket.OPEN) socket.close()
    }
  }
}

getSocketStatus = () => {
  return isSocketConnected
}

// return the state of the job if done or not
completedJob = (job) => {
  if (["complete", "error", "unknown"].includes(job.status)) return true
  return false
}

module.exports = {
  generateText,
  request,
  pollingLlm: processJobWithWebSocket,
  initWebSocketConnection,
  getSocketStatus,
}
