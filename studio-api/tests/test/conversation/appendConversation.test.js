// Appending an audio to a conversation created with partial=true: the part is
// queued on arrival, then stored and sent to transcription. The same route
// closes the conversation, with or without a last audio.

const mockCalls = []
const mockConversation = () => ({
  _id: "conv-1",
  organization: { organizationId: "org-1" },
  metadata: {
    transcription: {
      endpoint: "stt",
      transcriptionConfig: { punctuationConfig: {} },
    },
  },
  jobs: { transcription: { state: "pending", partial: true, parts: [] } },
})
const mockDispatched = () => ({
  processingJob: { jobid: "job-2" },
  file_data: {
    filePath: "audios/part-2.mp3",
    storageFilePath: "/storage/audios/part-2.mp3",
    filename: "part-2.wav",
  },
  seconds: 42.5,
})
let mockOpen

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    addPart: jest.fn(async () => {
      mockCalls.push("addPart")
      return { matchedCount: mockOpen ? 1 : 0 }
    }),
    updatePart: jest.fn(async () => {
      mockCalls.push("updatePart")
      return { matchedCount: 1 }
    }),
    removePart: jest.fn(async () => ({ modifiedCount: 1 })),
    update: jest.fn(async () => ({ matchedCount: 1 })),
  },
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
  () => ({
    dispatchUpload: jest.fn(async () => {
      mockCalls.push("dispatchUpload")
      return mockDispatched()
    }),
    recordUpload: jest.fn(async () => {}),
    validateConversation: jest.fn(async () => mockConversation()),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({ deleteFile: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
  () => ({ fetchJob: jest.fn(async () => {}) }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/partialAudio`,
  () => ({
    joinParts: jest.fn(async () => {
      mockCalls.push("joinParts")
    }),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
  () => ({
    injectSpeakerIdentification: jest.fn(async () => ({
      "X-Organization-Id": "org-1",
    })),
  }),
)

const { appendReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/append.js`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const upload = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const { deleteFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const { joinParts } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/partialAudio`,
)

function request(overrides = {}) {
  return {
    params: { organizationId: "org-1", conversationId: "conv-1" },
    payload: { data: { userId: "user-1" } },
    body: {},
    files: { file: { name: "part-2.wav", data: Buffer.from("audio") } },
    ...overrides,
  }
}

function response() {
  const res = { status: jest.fn(() => res), send: jest.fn(() => res) }
  return res
}

async function run(req = request()) {
  const res = response()
  const next = jest.fn()
  await appendReq(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCalls.length = 0
  mockOpen = true
})

describe("appendReq", () => {
  test("queues the part before storing the audio", async () => {
    const { res, next } = await run()

    expect(next).not.toHaveBeenCalled()
    expect(mockCalls).toEqual([
      "addPart",
      "dispatchUpload",
      "updatePart",
      "joinParts",
    ])
    expect(model.conversations.addPart).toHaveBeenCalledWith(
      "conv-1",
      "org-1",
      expect.objectContaining({ state: "uploading" }),
    )
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("transcribes with the settings of the conversation", async () => {
    const req = request()

    await run(req)

    expect(upload.dispatchUpload).toHaveBeenCalledWith({
      files: req.files,
      endpoint: "stt",
      transcriptionConfig: { punctuationConfig: {} },
      requireDuration: true,
      headers: { "X-Organization-Id": "org-1" },
      organizationId: "org-1",
      userId: "user-1",
    })
  })

  test("the dispatched part carries its job, audio and duration", async () => {
    await run()

    const partId = model.conversations.addPart.mock.calls[0][2].id
    expect(model.conversations.updatePart).toHaveBeenCalledWith(
      "conv-1",
      partId,
      "uploading",
      {
        job_id: "job-2",
        filepath: "audios/part-2.mp3",
        duration: 42.5,
        state: "pending",
      },
    )
  })

  test("joins its audio to the conversation once dispatched", async () => {
    await run()

    expect(joinParts).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "conv-1" }),
    )
  })

  test("meters the appended audio", async () => {
    await run()

    expect(upload.recordUpload).toHaveBeenCalledWith({
      organizationId: "org-1",
      userId: "user-1",
      seconds: 42.5,
      ref: { conversationId: "conv-1" },
    })
  })

  test("refuses a conversation that is not open to append", async () => {
    mockOpen = false

    const { next } = await run()

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(upload.dispatchUpload).not.toHaveBeenCalled()
  })

  test("refuses a request without file, or with several", async () => {
    const none = await run(request({ files: undefined }))
    expect(none.next.mock.calls[0][0]).toMatchObject({ status: 400 })

    const several = await run(
      request({ files: { file: [{ name: "a.wav" }, { name: "b.wav" }] } }),
    )
    expect(several.next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.addPart).not.toHaveBeenCalled()
  })

  test("a refused or failed dispatch frees its place in the queue", async () => {
    const refusal = Object.assign(new Error("Quota exceeded"), { status: 402 })
    upload.dispatchUpload.mockRejectedValueOnce(refusal)

    const { next } = await run()

    expect(next).toHaveBeenCalledWith(refusal)
    expect(model.conversations.removePart).toHaveBeenCalledWith(
      "conv-1",
      model.conversations.addPart.mock.calls[0][2].id,
    )
    expect(joinParts).not.toHaveBeenCalled()
    expect(upload.recordUpload).not.toHaveBeenCalled()
  })

  test("a part dropped while it was processed is refused", async () => {
    model.conversations.updatePart.mockResolvedValueOnce({ matchedCount: 0 })

    const { next } = await run()

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/part-2.mp3")
    expect(upload.recordUpload).not.toHaveBeenCalled()
  })
})

describe("appendReq with complete", () => {
  const closing = (overrides = {}) =>
    request({ body: { complete: "true" }, ...overrides })

  test("without audio, closes the conversation and settles its jobs", async () => {
    const { res, next } = await run(closing({ files: undefined }))

    expect(next).not.toHaveBeenCalled()
    expect(model.conversations.addPart).not.toHaveBeenCalled()
    expect(model.conversations.update).toHaveBeenCalledWith(
      expect.objectContaining({ "jobs.transcription.partial": false }),
    )
    expect(fetchJob).toHaveBeenCalledWith("conv-1", expect.any(Object))
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("with a last audio, closes once this audio is queued", async () => {
    model.conversations.update.mockImplementationOnce(async () => {
      mockCalls.push("close")
      return { matchedCount: 1 }
    })

    const { res, next } = await run(closing())

    expect(next).not.toHaveBeenCalled()
    expect(mockCalls).toEqual([
      "addPart",
      "dispatchUpload",
      "updatePart",
      "joinParts",
      "close",
    ])
    expect(upload.recordUpload).toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith({
      message: "The conversation is closed once its last audio is processed",
      conversationId: "conv-1",
    })
  })

  test("accepts the flag sent as a boolean", async () => {
    await run(request({ body: { complete: true }, files: undefined }))

    expect(model.conversations.update).toHaveBeenCalled()
  })

  test("a refused last audio leaves the conversation open", async () => {
    const refusal = Object.assign(new Error("Quota exceeded"), { status: 402 })
    upload.dispatchUpload.mockRejectedValueOnce(refusal)

    const { next } = await run(closing())

    expect(next).toHaveBeenCalledWith(refusal)
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("an audio sent under another field is not skipped", async () => {
    const { next } = await run(
      closing({ files: { audio: { name: "part-2.wav" } } }),
    )

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("refuses a conversation of another organization", async () => {
    const req = closing({
      files: undefined,
      params: { organizationId: "org-2", conversationId: "conv-1" },
    })

    const { next } = await run(req)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("refuses a conversation that was not created partial", async () => {
    upload.validateConversation.mockResolvedValueOnce({
      _id: "conv-1",
      organization: { organizationId: "org-1" },
      jobs: { transcription: { state: "done" } },
    })

    const { next } = await run(closing({ files: undefined }))

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })
})
