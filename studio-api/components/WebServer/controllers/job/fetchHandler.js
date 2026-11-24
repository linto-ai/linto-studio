const debug = require("debug")(
  "linto:components:WebServer:controllers:job:fetchHandler",
)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const { handleResult, handlePartResult } = require(
  `${process.cwd()}/components/WebServer/controllers/job/resultHandler`,
)
const { isAbandoned } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partial`,
)
const { joinParts } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partialAudio`,
)
const PART_STATES = require(`${process.cwd()}/lib/dao/conversation/partStates`)
const { ConversationTranscriptionFailed } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

// Polled less and less often: a long job does not need a tight loop
const WAIT_INTERVAL_MS = 2000
const WAIT_INTERVAL_MAX_MS = 15000
const WAIT_TIMEOUT_MS = 60 * 60 * 1000

async function fetchLogs(host, job) {
  try {
    return await axios.get(`${host}/job-log/${job.job_id}`)
  } catch (err) {
    debug(`Error while fetching job logs: ${err}`)
    return // A job doesn't exist all the time
  }
}

async function fetchJob(conv_id, conv_job) {
  try {
    // A conversation created to be appended has one job per part
    if (conv_job?.transcription?.parts) {
      return await fetchParts(conv_id, conv_job)
    }

    let job_queue = Object.keys(conv_job)
      .filter(
        (key) =>
          // We just want to fetch job that are not done or error and have a job_id
          !conv_job[key]?.result_id &&
          conv_job[key]?.job_id &&
          conv_job[key]?.state !== "error",
      )
      .map((key) => ({
        endpoint: conv_job[key].endpoint,
        job_id: conv_job[key].job_id,
        type: key,
      }))

    if (job_queue.length === 0) return

    job_queue = await Promise.all(
      job_queue.map(async (job) => {
        const host = `${process.env.GATEWAY_SERVICES}/${job.endpoint}`
        let current_job = job
        let logs
        try {
          let job_info = await axios.get(`${host}/job/${job.job_id}`)

          if (job_info.state === "error") {
            logs = await fetchLogs(host, job)
            logs !== undefined ? (current_job.job_logs = logs) : undefined
          }

          if (job_info.state === "done" && job_info.result_id) {
            await fetchResult(conv_id, { ...job, ...job_info })
          }

          current_job = {
            ...current_job,
            ...job_info, // job_info can update job previous state, that's why it's after
          }
        } catch (err) {
          if (current_job.job_log === undefined) {
            logs = await fetchLogs(host, job)
            logs !== undefined ? (current_job.job_logs = logs) : undefined
          } else logs !== undefined ? (current_job.job_logs = logs) : undefined
          current_job.state = "error"
        }
        return current_job
      }),
    )

    await updateJobConversation(conv_id, conv_job, job_queue)
    return { conv_id, conv_job, job_queue }
  } catch (err) {
    debug(`Error during job update : ${err}`)
  }
}

// Parts are merged in their arrival order: one that is not settled holds the
// next ones back
async function fetchParts(conv_id, conv_job) {
  if (PART_STATES.isSettled(conv_job.transcription.state)) return

  const conversation = (
    await model.conversations.getById(conv_id, [
      "jobs",
      "metadata",
      "locale",
      "speakers",
    ])
  )[0]
  const job = conversation.jobs.transcription

  for (const part of job.parts.filter(isAbandoned)) {
    await dropPart(conversation, part)
  }
  await joinParts(conversation)

  let offset = 0
  for (const part of job.parts) {
    if (part.state === PART_STATES.UPLOADING) break
    if (
      part.state === PART_STATES.PENDING &&
      !(await fetchPart(conversation, part, offset))
    ) {
      break
    }
    offset += part.duration
  }

  if (!job.partial && job.parts.every(isComplete)) {
    await closePartial(conversation)
  }
  return { conv_id, conv_job: conversation.jobs }
}

// Transcribed or failed, and its audio joined to the one of the conversation
function isComplete(part) {
  return PART_STATES.isSettled(part.state) && !part.filepath
}

// Kept when it got dispatched in the meantime: it is handled at the next call
async function dropPart(conversation, part) {
  const parts = conversation.jobs.transcription.parts
  const dropped = await model.conversations.removePart(
    conversation._id.toString(),
    part.id,
  )
  if (dropped.modifiedCount === 1) parts.splice(parts.indexOf(part), 1)
}

// True when this call settled the part: merged in the conversation, or failed
async function fetchPart(conversation, part, offset) {
  const job = {
    endpoint: conversation.metadata.transcription.endpoint,
    job_id: part.job_id,
  }
  const host = `${process.env.GATEWAY_SERVICES}/${job.endpoint}`

  try {
    const job_info = await axios.get(`${host}/job/${job.job_id}`)
    if (job_info.state === "done" && job_info.result_id) {
      const result = await getResult(
        { ...job, ...job_info },
        conversation.metadata,
      )
      if (!(await handlePartResult(result, part, offset, conversation))) {
        return false
      }
      part.state = PART_STATES.DONE
      return true
    }
    if (job_info.state !== "error") return false
  } catch (err) {
    debug(`Error while fetching part ${part.id}: ${err}`)
  }

  return await failPart(conversation, part, host, job)
}

async function failPart(conversation, part, host, job) {
  const conversationId = conversation._id.toString()
  const failed = await model.conversations.updatePart(
    conversationId,
    part.id,
    PART_STATES.PENDING,
    { state: PART_STATES.ERROR },
  )
  if (failed.matchedCount !== 1) return false
  part.state = PART_STATES.ERROR

  const logs = await fetchLogs(host, job)
  if (logs !== undefined) {
    await model.conversations.update({
      _id: conversationId,
      "jobs.transcription.job_logs": logs,
    })
  }
  return true
}

async function closePartial(conversation) {
  const job = conversation.jobs.transcription
  const failed = job.parts.some((part) => part.state === PART_STATES.ERROR)
  const state = failed ? "error" : "done"

  const closed = await model.conversations.update({
    _id: conversation._id.toString(),
    "jobs.transcription.state": state,
  })
  if (closed.matchedCount === 1) job.state = state
}

async function fetchResult(conv_id, job) {
  try {
    const conversation = await model.conversations.getById(conv_id)

    const result = await getResult(job, conversation[0].metadata)
    if (job.state === "done" && job.result_id) {
      await handleResult(result, job, conversation[0])
    }
  } catch (err) {
    debug(`Error while handling result: ${err}`)
    throw err
  }
}

async function getResult(job, metadata) {
  try {
    let url = `${process.env.GATEWAY_SERVICES}/${job.endpoint}/results/${job.result_id}`
    const isWhisper =
      metadata.transcription?.transcriptionConfig?.modelType === "whisper"
    if (
      !isWhisper &&
      metadata.transcription.transcriptionConfig.enableNormalization &&
      metadata.transcription.lang !== "*"
    ) {
      url += "?convert_numbers=true"
    }

    const options = { headers: { accept: "application/json" } }

    return await axios.get(url, options)
  } catch (err) {
    debug(`Error while fetching result: ${err}`)
    throw err
  }
}

// Holds the caller until the job ends, then gives its result. `isCancelled`
// stops the wait when nobody is left to answer.
async function waitResult(job, metadata, isCancelled = () => false) {
  const host = `${process.env.GATEWAY_SERVICES}/${job.endpoint}`
  const deadline = Date.now() + WAIT_TIMEOUT_MS
  let interval = WAIT_INTERVAL_MS

  while (Date.now() < deadline) {
    if (isCancelled()) {
      throw new ConversationTranscriptionFailed("The request was closed")
    }
    const job_info = await axios.get(`${host}/job/${job.job_id}`)
    if (job_info.state === "done" && job_info.result_id) {
      return await getResult({ ...job, ...job_info }, metadata)
    }
    if (job_info.state === "error") {
      const logs = await fetchLogs(host, job)
      throw new ConversationTranscriptionFailed(logs)
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
    interval = Math.min(interval * 1.5, WAIT_INTERVAL_MAX_MS)
  }
  throw new ConversationTranscriptionFailed("The transcription took too long")
}

async function updateJobConversation(conv_id, conv_job, job_queue) {
  job_queue.map((job) => {
    conv_job[job.type] = {
      ...conv_job[job.type],
      ...job,
    }
    delete conv_job[job.type].type
  })
  await model.conversations.updateJob(conv_id, conv_job)
}

module.exports = { fetchJob, waitResult }
