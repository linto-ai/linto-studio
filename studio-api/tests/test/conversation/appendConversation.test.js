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
const mockRecord = jest.fn(async () => {})
const mockEnforce = jest.fn(async () => null)
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
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  postFormData: jest.fn(async () => ({ jobid: "job-2" })),
}))
jest.mock(`${process.cwd()}/lib/saas`, () => ({
  enforce: (...args) => mockEnforce(...args),
  record: (...args) => mockRecord(...args),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
  () => ({
    prepareFileFormData: jest.fn(async () => {
      mockCalls.push("storeFile")
      return {
        form: {},
        file_data: {
          filePath: "audios/part-2.mp3",
          storageFilePath: "/storage/audios/part-2.mp3",
          filename: "part-2.wav",
        },
      }
    }),
    validateConversation: jest.fn(async () => mockConversation()),
    prepareRequest: jest.fn(() => ({ formData: {} })),
    getTranscriptionService: jest.fn(
      (endpoint) => `http://gateway/${endpoint}/transcribe`,
    ),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({ deleteFile: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/transform`,
  () => ({ probeAudioDuration: jest.fn(async () => 42.5) }),
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
const axios = require(`${process.cwd()}/lib/utility/axios`)
const upload = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const { deleteFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { probeAudioDuration } = require(
  `${process.cwd()}/components/WebServer/controllers/files/transform`,
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
      "storeFile",
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
    await run(appendReq)

    expect(upload.prepareRequest).toHaveBeenCalledWith(
      {},
      { punctuationConfig: {} },
      true,
      { "X-Organization-Id": "org-1" },
    )
    expect(axios.postFormData).toHaveBeenCalledWith(
      "http://gateway/stt/transcribe",
      { formData: {} },
    )
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

  test("meters the appended audio on import.minutes", async () => {
    await run(appendReq)

    expect(mockEnforce).toHaveBeenCalledWith({
      orgId: "org-1",
      capability: "import.minutes",
      seconds: 42.5,
      userId: "user-1",
    })
    expect(mockRecord).toHaveBeenCalledWith({
      orgId: "org-1",
      userId: "user-1",
      capability: "import.minutes",
      seconds: 42.5,
      ref: { conversationId: "conv-1" },
    })
  })

  test("refuses a conversation that is not open to append", async () => {
    mockOpen = false

    const { next } = await run(appendReq)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(upload.prepareFileFormData).not.toHaveBeenCalled()
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

  test("a refused quota leaves nothing behind", async () => {
    const refusal = Object.assign(new Error("Quota exceeded"), { status: 402 })
    mockEnforce.mockRejectedValueOnce(refusal)

    const { next } = await run(appendReq)

    expect(next).toHaveBeenCalledWith(refusal)
    expect(axios.postFormData).not.toHaveBeenCalled()
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/part-2.mp3")
    expect(model.conversations.removePart).toHaveBeenCalledTimes(1)
    expect(joinParts).not.toHaveBeenCalled()
    expect(mockRecord).not.toHaveBeenCalled()
  })

  test("a failed dispatch frees its place in the queue", async () => {
    axios.postFormData.mockRejectedValueOnce(new Error("gateway down"))

    const { next } = await run(appendReq)

    expect(next.mock.calls[0][0].message).toBe("gateway down")
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/part-2.mp3")
    expect(model.conversations.removePart).toHaveBeenCalledWith(
      "conv-1",
      model.conversations.addPart.mock.calls[0][2].id,
    )
    expect(mockRecord).not.toHaveBeenCalled()
  })

  test("an audio whose duration cannot be read is refused", async () => {
    probeAudioDuration.mockResolvedValueOnce(NaN)

    const { next } = await run(appendReq)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(axios.postFormData).not.toHaveBeenCalled()
    expect(model.conversations.removePart).toHaveBeenCalledTimes(1)
  })

  test("a part dropped while it was processed is refused", async () => {
    model.conversations.updatePart.mockResolvedValueOnce({ matchedCount: 0 })

    const { next } = await run(appendReq)

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/part-2.mp3")
    expect(mockRecord).not.toHaveBeenCalled()
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
