const FormData = require("form-data")
const utf8 = require("utf8")
const { v4: uuidv4 } = require("uuid")

const LogManager = require(`${process.cwd()}/lib/logger/manager`)

const { initConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)
const { sendToTranscription, recordUpload } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const { probeUpload } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { waitResult } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const { fillConversation } = require(
  `${process.cwd()}/components/WebServer/controllers/job/resultHandler`,
)

const { ConversationNoFileUploaded } = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)

// Sends the upload to transcription as it is: nothing is stored nor converted
async function dispatchUnstoredUpload(file, request) {
  if (!file) throw new ConversationNoFileUploaded()

  const seconds = await probeUpload(file)
  const form = new FormData()
  form.append("file", file.data, { filename: uuidv4() })

  const processingJob = await sendToTranscription(form, seconds, request)
  return { processingJob, filename: utf8.decode(file.name), seconds }
}

// Nothing is stored: the request waits for the transcription and answers it
// as the conversation a regular upload would have created
async function transcribeSync(req, res, headers) {
  const userId = req.payload.data.userId
  const { processingJob, filename, seconds } = await dispatchUnstoredUpload(
    req.files?.file,
    {
      endpoint: req.body.endpoint,
      transcriptionConfig: req.body.transcriptionConfig,
      headers,
      organizationId: req.params.organizationId,
      userId,
    },
  )
  // The upload must not stay in memory for the whole wait
  req.files = null

  await recordUpload({
    organizationId: req.params.organizationId,
    userId,
    seconds,
    ref: { jobId: processingJob.jobid },
  })

  let clientGone = false
  res.on("close", () => {
    clientGone = true
  })

  const conversation = initConversation(req.body, userId, processingJob.jobid)
  // Not checked here: there is no folder to put it in
  delete conversation.folderId
  conversation.metadata.audio = { filename, duration: seconds }
  const result = await waitResult(
    { endpoint: req.body.endpoint, job_id: processingJob.jobid },
    conversation.metadata,
    () => clientGone,
  )
  // A silent audio has no transcription, which is not an error here
  if (result?.transcription_result?.length > 0) {
    fillConversation(result, conversation)
  }
  conversation.jobs.transcription.state = "done"
  res.status(200).send(conversation)

  LogManager.logTranscriptionEvent(req, {
    jobId: processingJob.jobid,
    conversation: {
      name: conversation.name,
      duration: seconds,
      transcription: conversation.metadata.transcription,
    },
  })
}

module.exports = { transcribeSync }
