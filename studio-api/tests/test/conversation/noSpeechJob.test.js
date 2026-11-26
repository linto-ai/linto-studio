// A transcription that ends without any word fails with an explicit reason, so
// an API client can tell an audio without speech from a failed transcription.

// music-metadata is ESM-only, not loadable by Jest
jest.mock("music-metadata", () => ({ parseStream: jest.fn() }), {
  virtual: true,
})

let mockDoc
let mockJobs
let mockResults

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    getById: jest.fn(async () => [structuredClone(mockDoc)]),
    updateJob: jest.fn(async () => ({ matchedCount: 1 })),
    updateConvOnTranscriptionResult: jest.fn(async () => ({
      matchedCount: 1,
    })),
  },
}))

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(async (url) => {
    const [, kind, id] = url.match(/\/(job|job-log|results)\/([^/?]+)/)
    if (kind === "job") return mockJobs[id]
    if (kind === "results") return mockResults[id]
    return `logs of ${id}`
  }),
}))

const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const DONE_STEPS = {
  preprocessing: { required: true, status: "done", progress: 1 },
  transcription: { required: true, status: "done", progress: 1 },
  diarization: { required: true, status: "done", progress: 1 },
}

// What linto-transcription-service returns for an audio without speech
const EMPTY_RESULT = {
  transcription_result: "",
  raw_transcription: "",
  confidence: 0,
  segments: [],
}

function conversation() {
  return {
    _id: "conv",
    locale: "fr-FR",
    speakers: [],
    text: [],
    metadata: {
      normalize: { filter: {} },
      transcription: { transcriptionConfig: {} },
    },
    jobs: {
      transcription: {
        job_id: "job-1",
        endpoint: "whisper",
        state: "started",
        steps: {
          transcription: { required: true, status: "started", progress: 0 },
        },
      },
    },
  }
}

// The transcription job as it is written in the conversation
function storedJob() {
  const [, jobs] = model.conversations.updateJob.mock.calls.at(-1)
  return jobs.transcription
}

beforeEach(() => {
  jest.clearAllMocks()
  mockDoc = conversation()
  mockResults = { "result-1": EMPTY_RESULT }
})

test("an empty transcription fails with the NO_SPEECH reason", async () => {
  mockJobs = {
    "job-1": { state: "done", result_id: "result-1", steps: DONE_STEPS },
  }

  await fetchJob("conv", mockDoc.jobs)

  const job = storedJob()
  expect(job.state).toBe("error")
  expect(job.error).toEqual({
    code: "NO_SPEECH",
    status: 422,
    message: "No speech was detected in the audio",
  })
  expect(job.steps).toEqual(DONE_STEPS)
  expect(job.job_logs).toBe("logs of job-1")
  expect(
    model.conversations.updateConvOnTranscriptionResult,
  ).not.toHaveBeenCalled()
})

test("a result without transcription is an empty one", async () => {
  mockJobs = {
    "job-1": { state: "done", result_id: "result-1", steps: DONE_STEPS },
  }
  mockResults = { "result-1": {} }

  await fetchJob("conv", mockDoc.jobs)

  expect(storedJob().error.code).toBe("NO_SPEECH")
})

test("a failed transcription job keeps failing without a reason", async () => {
  mockJobs = { "job-1": { state: "error", steps: {} } }

  await fetchJob("conv", mockDoc.jobs)

  const job = storedJob()
  expect(job.state).toBe("error")
  expect(job.error).toBeUndefined()
  expect(job.job_logs).toBe("logs of job-1")
})

test("a job still running is left without a reason", async () => {
  mockJobs = { "job-1": { state: "started", steps: {} } }

  await fetchJob("conv", mockDoc.jobs)

  const job = storedJob()
  expect(job.state).toBe("started")
  expect(job.error).toBeUndefined()
})
