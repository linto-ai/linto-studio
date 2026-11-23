// POST conversations/create with partial=true: the conversation is created
// pending and open to append, its uploaded audio being the first part.

// music-metadata is ESM-only, not loadable by Jest
jest.mock("music-metadata", () => ({ parseStream: jest.fn() }), {
  virtual: true,
})

let mockCreated

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  organizations: {
    getByIdAndUser: jest.fn(async () => [{ _id: "org-1", securityLevel: 0 }]),
  },
  conversations: {
    create: jest.fn(async (conversation) => {
      mockCreated = conversation
      conversation._id = "conv-1"
      return { insertedCount: 1, insertedId: "conv-1" }
    }),
  },
  categories: { createDefaultCategories: jest.fn(async () => {}) },
}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  postFormData: jest.fn(async () => ({ jobid: "job-1" })),
}))
jest.mock(`${process.cwd()}/lib/saas`, () => ({
  enabled: () => false,
  record: jest.fn(async () => {}),
}))
jest.mock(`${process.cwd()}/lib/logger/manager`, () => ({
  logTranscriptionEvent: jest.fn(),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/services/utility`,
  () => ({
    getTranscriptionServiceByEndpoint: jest.fn(async () => ({
      security_level: 0,
    })),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({ deleteFile: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
  () => ({
    prepareFileFormData: jest.fn(async () => ({
      form: {},
      file_data: {
        filePath: "audios/first.mp3",
        storageFilePath: "/storage/audios/first.mp3",
        filename: "first.wav",
      },
    })),
    prepareRequest: jest.fn(() => ({})),
    getTranscriptionService: jest.fn(() => "http://gateway/stt/transcribe"),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
  () => ({
    ...jest.requireActual(
      `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
    ),
    addFileMetadataToConversation: jest.fn(async (conversation, file) => {
      conversation.metadata.audio = {
        filename: file.filename,
        duration: 12.5,
        mimetype: "audio/mpeg",
        filepath: file.filePath,
      }
      return conversation
    }),
    addAudioDuration: jest.fn(),
  }),
)

const { transcribeReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/transcriptor.js`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

function request(body = {}, files = { file: { name: "first.wav" } }) {
  return {
    params: { organizationId: "org-1" },
    payload: { data: { userId: "user-1" } },
    body: { name: "meeting", lang: "fr-FR", endpoint: "stt", ...body },
    files,
  }
}

async function create(req) {
  const res = { status: jest.fn(() => res), send: jest.fn(() => res) }
  const next = jest.fn()
  await transcribeReq(req, res, next)
  return { res, next }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCreated = undefined
})

describe("create with partial", () => {
  test("the conversation is pending and open to append", async () => {
    const { res, next } = await create(request({ partial: "true" }))

    expect(next).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({ conversationId: "conv-1" }),
    )

    const job = mockCreated.jobs.transcription
    expect(job.state).toBe("pending")
    expect(job.partial).toBe(true)
    expect(job.job_id).toBeUndefined()
    expect(job.parts).toHaveLength(1)
    expect(job.parts[0]).toMatchObject({
      job_id: "job-1",
      duration: 12.5,
      state: "pending",
    })
    // Already the audio of the conversation: nothing to join
    expect(job.parts[0].filepath).toBeUndefined()
    expect(mockCreated.metadata.audio.filepath).toBe("audios/first.mp3")
  })

  test("keeps the speaker identification collections for the next parts", async () => {
    await create(request({ partial: "true" }))

    expect(
      mockCreated.metadata.transcription.speakerIdentificationCollections,
    ).toEqual([])
  })

  test("is refused with a url", async () => {
    const { next } = await create(
      request({ partial: "true", url: "https://example.org/audio.mp3" }, null),
    )

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.create).not.toHaveBeenCalled()
  })

  test("is refused with several files", async () => {
    const files = { file: [{ name: "a.wav" }, { name: "b.wav" }] }

    const { next } = await create(request({ partial: "true" }, files))

    expect(next.mock.calls[0][0]).toMatchObject({ status: 400 })
    expect(model.conversations.create).not.toHaveBeenCalled()
  })
})

describe("create without partial", () => {
  test.each([[undefined], ["false"], [""]])(
    "partial=%p keeps the single job",
    async (partial) => {
      const { next } = await create(request({ partial }))

      expect(next).not.toHaveBeenCalled()
      const job = mockCreated.jobs.transcription
      expect(job.job_id).toBe("job-1")
      expect(job.partial).toBeUndefined()
      expect(job.parts).toBeUndefined()
      expect(
        mockCreated.metadata.transcription.speakerIdentificationCollections,
      ).toBeUndefined()
    },
  )
})
