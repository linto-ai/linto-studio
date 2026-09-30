const fs = require("fs")

const mockRecord = jest.fn(async () => {})
const mockConversation = () => ({
  _id: { toString: () => "conv-1" },
  owner: { toString: () => "user-1" },
  organization: { organizationId: { toString: () => "org-1" } },
  type: { from_session_id: "sess-1" },
  metadata: {
    audio: {
      filename: "sess-1-9.wav",
      mimetype: "audio/wav",
      filepath: "session_audio/sess-1-9.wav",
      duration: 0,
    },
    transcription: { endpoint: "whisper", transcriptionConfig: {} },
  },
})
let mockStored

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    // Like the real model: the payload loses its _id
    update: jest.fn(async (payload) => {
      delete payload._id
      return { matchedCount: 1 }
    }),
  },
  organizations: { getById: jest.fn(async () => []) },
}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  postFormData: jest.fn(async () => ({ jobid: "job-1" })),
}))
jest.mock(`${process.cwd()}/lib/saas`, () => ({
  enabled: () => true,
  record: (...args) => mockRecord(...args),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    STORE_TYPE: { AUDIO_SESSION: "audio_session" },
    storeFile: jest.fn(async () => ({
      filename: "sess-1.mp3",
      filePath: "audios/sess-1.mp3",
      storageFilePath: "/tmp/sess-1.mp3",
    })),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
  () => ({
    validateConversation: jest.fn(async () => mockStored),
    getTranscriptionService: jest.fn(() => "http://gateway/whisper/transcribe"),
    prepareTranscriptionRequest: jest.fn(async () => ({})),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
  () => ({
    addFileMetadataToConversation: jest.fn(async (conversation, file) => {
      conversation.metadata.audio = {
        filename: file.filename,
        duration: 90,
        mimetype: "audio/mpeg",
        filepath: file.filePath,
      }
      return conversation
    }),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/injection`,
  () => ({ applySpeakerIdentification: jest.fn() }),
)

const { sessionReq } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/organizations/uploader/offline.js`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)

beforeEach(() => {
  mockRecord.mockClear()
  mockStored = mockConversation()
  jest.spyOn(fs, "existsSync").mockReturnValue(true)
})
afterEach(() => jest.restoreAllMocks())

describe("sessionReq: offline transcription of a session is metered", () => {
  test("records the converted audio duration on import.minutes", async () => {
    await sessionReq("conv-1")
    expect(mockRecord).toHaveBeenCalledTimes(1)
    expect(mockRecord).toHaveBeenCalledWith({
      orgId: "org-1",
      userId: "user-1",
      capability: "import.minutes",
      seconds: 90,
      ref: { conversationId: "conv-1", sessionId: "sess-1" },
    })
  })

  test("records nothing when the transcription was not dispatched", async () => {
    axios.postFormData.mockRejectedValueOnce(new Error("gateway down"))
    await sessionReq("conv-1")
    expect(mockRecord).not.toHaveBeenCalled()
  })
})
