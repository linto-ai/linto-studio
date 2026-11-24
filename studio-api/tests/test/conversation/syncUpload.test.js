// A sync upload: the audio is sent to transcription as it is, the request
// waits and answers the transcription. Nothing is stored.

// music-metadata is ESM-only, not loadable by Jest
jest.mock("music-metadata", () => ({ parseStream: jest.fn() }), {
  virtual: true,
})

const mockCalls = []

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: { create: jest.fn() },
}))
jest.mock(`${process.cwd()}/lib/logger/manager`, () => ({
  logTranscriptionEvent: jest.fn(),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    probeUpload: jest.fn(async () => {
      mockCalls.push("probe")
      return 12.5
    }),
    storeFile: jest.fn(),
    deleteFile: jest.fn(),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
  () => ({
    sendToTranscription: jest.fn(async () => {
      mockCalls.push("sendToTranscription")
      return { jobid: "job-1" }
    }),
    recordUpload: jest.fn(async () => {}),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
  () => ({
    waitResult: jest.fn(async () => ({
      transcription_result: "bonjour",
      confidence: 1,
      segments: [
        {
          spk_id: "spk1",
          start: 1,
          end: 2,
          raw_segment: "bonjour",
          segment: "bonjour",
          words: [{ word: "bonjour", start: 1, end: 2, conf: 1 }],
        },
      ],
    })),
  }),
)

const { transcribeSync } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/syncUpload.js`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const LogManager = require(`${process.cwd()}/lib/logger/manager`)
const upload = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const store = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { waitResult } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)

const utf8 = require("utf8")

const HEADERS = { "X-Organization-Id": "org-1" }

// The body as the create route leaves it once validated
function request(body = {}) {
  return {
    params: { organizationId: "org-1" },
    payload: { data: { userId: "user-1" } },
    body: {
      lang: "fr-FR",
      endpoint: "stt",
      transcriptionConfig: '{"modelType":"whisper"}',
      organizationId: "org-1",
      userId: "user-1",
      ...body,
    },
    // File names reach the API as utf8 bytes, like any upload
    files: {
      file: {
        name: utf8.encode("réunion.wav"),
        data: Buffer.from("raw audio"),
      },
    },
  }
}

function response() {
  const listeners = {}
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    on: jest.fn((event, listener) => {
      listeners[event] = listener
    }),
    emit: (event) => listeners[event](),
  }
  return res
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCalls.length = 0
})

describe("transcribeSync", () => {
  test("answers the transcription and its speakers", async () => {
    const res = response()

    await transcribeSync(request({ name: "meeting" }), res, HEADERS)

    expect(res.status).toHaveBeenCalledWith(200)
    const answered = res.send.mock.calls[0][0]
    expect(answered.text.map((turn) => turn.segment)).toEqual(["bonjour"])
    expect(answered.text[0].words[0]).toMatchObject({ stime: 1, etime: 2 })
    expect(answered.speakers).toHaveLength(1)
    expect(answered.text[0].speaker_id).toBe(answered.speakers[0].speaker_id)
    expect(answered.metadata.audio).toEqual({
      filename: "réunion.wav",
      duration: 12.5,
    })
    expect(answered.jobs.transcription.state).toBe("done")
    expect(answered._id).toBeUndefined()
  })

  test("stores nothing: no file, no conversion, no conversation", async () => {
    await transcribeSync(request(), response(), HEADERS)

    expect(store.storeFile).not.toHaveBeenCalled()
    expect(store.deleteFile).not.toHaveBeenCalled()
    expect(model.conversations.create).not.toHaveBeenCalled()
  })

  test("measures the upload then sends it as it was received", async () => {
    const req = request()
    const file = req.files.file

    await transcribeSync(req, response(), HEADERS)

    expect(mockCalls).toEqual(["probe", "sendToTranscription"])
    expect(store.probeUpload).toHaveBeenCalledWith(file)
    const [form, seconds, settings] = upload.sendToTranscription.mock.calls[0]
    expect(form.getBuffer().toString()).toContain("raw audio")
    expect(seconds).toBe(12.5)
    expect(settings).toEqual({
      endpoint: "stt",
      transcriptionConfig: '{"modelType":"whisper"}',
      headers: HEADERS,
      organizationId: "org-1",
      userId: "user-1",
    })
  })

  test("meters the audio, with its job as reference", async () => {
    await transcribeSync(request(), response(), HEADERS)

    expect(upload.recordUpload).toHaveBeenCalledWith({
      organizationId: "org-1",
      userId: "user-1",
      seconds: 12.5,
      ref: { jobId: "job-1" },
    })
  })

  test("waits for the job with the endpoint and settings of the request", async () => {
    await transcribeSync(request(), response(), HEADERS)

    expect(waitResult).toHaveBeenCalledWith(
      { endpoint: "stt", job_id: "job-1" },
      expect.objectContaining({
        transcription: expect.objectContaining({
          lang: "fr-FR",
          transcriptionConfig: { modelType: "whisper" },
        }),
      }),
      expect.any(Function),
    )
  })

  test("does not keep the upload in memory during the wait", async () => {
    const req = request()
    waitResult.mockImplementationOnce(async () => {
      expect(req.files).toBeNull()
      return { transcription_result: "", segments: [] }
    })

    await transcribeSync(req, response(), HEADERS)

    expect(waitResult).toHaveBeenCalledTimes(1)
  })

  test("tells the wait when the client is gone", async () => {
    const res = response()
    let isClientGone
    waitResult.mockImplementationOnce(async (job, metadata, isCancelled) => {
      isClientGone = isCancelled
      expect(isClientGone()).toBe(false)
      res.emit("close")
      expect(isClientGone()).toBe(true)
      return { transcription_result: "", segments: [] }
    })

    await transcribeSync(request(), res, HEADERS)

    expect(isClientGone).toBeDefined()
  })

  test("shows in the activity log without a conversation to read", async () => {
    const req = request({ name: "meeting" })

    await transcribeSync(req, response(), HEADERS)

    expect(LogManager.logTranscriptionEvent).toHaveBeenCalledWith(req, {
      jobId: "job-1",
      conversation: {
        name: "meeting",
        duration: 12.5,
        transcription: expect.objectContaining({
          lang: "fr-FR",
          transcriptionConfig: { modelType: "whisper" },
        }),
      },
    })
  })

  test("a silent audio answers an empty transcription", async () => {
    waitResult.mockResolvedValueOnce({ transcription_result: "", segments: [] })
    const res = response()

    await transcribeSync(request(), res, HEADERS)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send.mock.calls[0][0].text).toEqual([])
  })

  test("does not answer a folder it did not check", async () => {
    const res = response()

    await transcribeSync(request({ folderId: "folder-1" }), res, HEADERS)

    expect(res.send.mock.calls[0][0].folderId).toBeUndefined()
  })

  test("a failed transcription answers nothing and is not logged", async () => {
    const failure = Object.assign(new Error("worker crashed"), { status: 502 })
    waitResult.mockRejectedValueOnce(failure)
    const res = response()

    await expect(transcribeSync(request(), res, HEADERS)).rejects.toBe(failure)

    expect(res.send).not.toHaveBeenCalled()
    expect(LogManager.logTranscriptionEvent).not.toHaveBeenCalled()
  })

  test("a refused quota sends nothing and meters nothing", async () => {
    const refusal = Object.assign(new Error("Quota exceeded"), { status: 402 })
    upload.sendToTranscription.mockRejectedValueOnce(refusal)

    await expect(transcribeSync(request(), response(), HEADERS)).rejects.toBe(
      refusal,
    )

    expect(upload.recordUpload).not.toHaveBeenCalled()
    expect(waitResult).not.toHaveBeenCalled()
  })

  test("a file that is not a media is refused before the quota", async () => {
    const refusal = Object.assign(new Error("Unsupported"), { status: 415 })
    store.probeUpload.mockRejectedValueOnce(refusal)

    await expect(transcribeSync(request(), response(), HEADERS)).rejects.toBe(
      refusal,
    )

    expect(upload.sendToTranscription).not.toHaveBeenCalled()
  })

  test("needs a file", async () => {
    const req = { ...request(), files: undefined }

    await expect(
      transcribeSync(req, response(), HEADERS),
    ).rejects.toMatchObject({ status: 400 })
    expect(store.probeUpload).not.toHaveBeenCalled()
  })
})
