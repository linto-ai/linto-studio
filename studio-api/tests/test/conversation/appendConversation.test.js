// Appending an audio to a conversation created with partial=true: the part is
// queued on arrival, then stored and sent to transcription.

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

const { appendReq, finishReq } = require(
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
    files: { file: { name: "part-2.wav", data: Buffer.from("audio") } },
    ...overrides,
  }
}

function response() {
  const res = { status: jest.fn(() => res), send: jest.fn(() => res) }
  return res
}

async function run(controller, req = request()) {
  const res = response()
  const next = jest.fn()
  await controller(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCalls.length = 0
  mockOpen = true
})

describe("appendReq", () => {
  test("queues the part before storing the audio", async () => {
    const { res, next } = await run(appendReq)

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

    await run(appendReq, req)

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
    await run(appendReq)

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
    await run(appendReq)

    expect(joinParts).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "conv-1" }),
    )
  })

  test("meters the appended audio", async () => {
    await run(appendReq)

    expect(upload.recordUpload).toHaveBeenCalledWith({
      organizationId: "org-1",
      userId: "user-1",
      seconds: 42.5,
      ref: { conversationId: "conv-1" },
    })
  })

  test("refuses a conversation that is not open to append", async () => {
    mockOpen = false

    const { next } = await run(appendReq)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(upload.dispatchUpload).not.toHaveBeenCalled()
  })

  test("refuses a request without file, or with several", async () => {
    const none = await run(appendReq, request({ files: undefined }))
    expect(none.next.mock.calls[0][0]).toMatchObject({ status: 400 })

    const several = await run(
      appendReq,
      request({ files: { file: [{ name: "a.wav" }, { name: "b.wav" }] } }),
    )
    expect(several.next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.addPart).not.toHaveBeenCalled()
  })

  test("a refused or failed dispatch frees its place in the queue", async () => {
    const refusal = Object.assign(new Error("Quota exceeded"), { status: 402 })
    upload.dispatchUpload.mockRejectedValueOnce(refusal)

    const { next } = await run(appendReq)

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

    const { next } = await run(appendReq)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/part-2.mp3")
    expect(upload.recordUpload).not.toHaveBeenCalled()
  })
})

describe("finishReq", () => {
  test("closes the conversation to append and settles its jobs", async () => {
    const { res, next } = await run(finishReq)

    expect(next).not.toHaveBeenCalled()
    expect(model.conversations.update).toHaveBeenCalledWith(
      expect.objectContaining({ "jobs.transcription.partial": false }),
    )
    expect(fetchJob).toHaveBeenCalledWith("conv-1", expect.any(Object))
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test("refuses a conversation of another organization", async () => {
    const req = request({
      params: { organizationId: "org-2", conversationId: "conv-1" },
    })

    const { next } = await run(finishReq, req)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })

  test("refuses a conversation that was not created partial", async () => {
    upload.validateConversation.mockResolvedValueOnce({
      _id: "conv-1",
      organization: { organizationId: "org-1" },
      jobs: { transcription: { state: "done" } },
    })

    const { next } = await run(finishReq)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.update).not.toHaveBeenCalled()
  })
})
