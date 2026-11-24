// A sync upload holds its request until the transcription job ends.

// music-metadata is ESM-only, not loadable by Jest
jest.mock("music-metadata", () => ({ parseStream: jest.fn() }), {
  virtual: true,
})

let mockStates

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/partialAudio`,
  () => ({ joinParts: jest.fn() }),
)
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(async (url) => {
    if (url.includes("/job-log/")) return "worker crashed"
    if (url.includes("/results/")) return { transcription_result: "bonjour" }
    return mockStates.length > 1 ? mockStates.shift() : mockStates[0]
  }),
}))

const { waitResult } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)

const job = { endpoint: "stt", job_id: "job-1" }
const metadata = {
  transcription: { lang: "fr-FR", transcriptionConfig: {} },
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  process.env.GATEWAY_SERVICES = "http://gateway"
})
afterEach(() => jest.useRealTimers())

// Lets the pending timers elapse until the call settles
async function settle(promise) {
  let settled = false
  const outcome = promise.then(
    (value) => ({ value }),
    (error) => ({ error }),
  )
  outcome.then(() => (settled = true))
  while (!settled) await jest.advanceTimersByTimeAsync(2000)
  return outcome
}

describe("waitResult", () => {
  test("polls the job until it is done, then gives its result", async () => {
    mockStates = [
      { state: "pending" },
      { state: "started" },
      { state: "done", result_id: "result-1" },
    ]

    const { value } = await settle(waitResult(job, metadata))

    expect(value).toEqual({ transcription_result: "bonjour" })
    expect(axios.get).toHaveBeenCalledWith(
      "http://gateway/stt/results/result-1",
      expect.any(Object),
    )
    const polls = axios.get.mock.calls.filter(([url]) =>
      url.endsWith("/job/job-1"),
    )
    expect(polls).toHaveLength(3)
  })

  test("a failed job is an error carrying its logs", async () => {
    mockStates = [{ state: "started" }, { state: "error" }]

    const { error } = await settle(waitResult(job, metadata))

    expect(error).toMatchObject({ status: 502, message: "worker crashed" })
  })

  test("stops when nobody is left to answer", async () => {
    mockStates = [{ state: "started" }]
    let gone = false
    const waiting = settle(waitResult(job, metadata, () => gone))
    gone = true

    const { error } = await waiting

    expect(error).toMatchObject({ message: "The request was closed" })
    expect(axios.get.mock.calls.length).toBeLessThan(3)
  })

  test("polls less and less often", async () => {
    mockStates = [{ state: "started" }]
    waitResult(job, metadata).catch(() => {})

    await jest.advanceTimersByTimeAsync(60 * 1000)

    // Every 2 s it would be 30 polls
    expect(axios.get.mock.calls.length).toBeLessThan(12)
  })

  test("gives up on a job that never ends", async () => {
    mockStates = [{ state: "started" }]

    const { error } = await settle(waitResult(job, metadata))

    expect(error).toMatchObject({
      status: 502,
      message: "The transcription took too long",
    })
  })
})
