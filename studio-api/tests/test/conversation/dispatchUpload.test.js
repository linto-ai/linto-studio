// One place checks the SaaS quota on the duration of an upload and sends it to
// transcription: create and append both go through it.

const mockCalls = []
const mockEnforce = jest.fn(async () => null)
const mockRecord = jest.fn(async () => {})
let mockSaas

jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({}))
jest.mock(`${process.cwd()}/lib/saas`, () => ({
  enabled: () => mockSaas,
  enforce: (...args) => {
    mockCalls.push("enforce")
    return mockEnforce(...args)
  },
  record: (...args) => mockRecord(...args),
}))
jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  postFormData: jest.fn(async () => {
    mockCalls.push("transcribe")
    return { jobid: "job-1" }
  }),
}))
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    STORE_TYPE: { AUDIO: "audio", MULTI_AUDIO: "multi_audio" },
    storeFile: jest.fn(async () => {
      mockCalls.push("store")
      return {
        filePath: "audios/stored.mp3",
        storageFilePath: "/storage/audios/stored.mp3",
        filename: "meeting.wav",
      }
    }),
    deleteFile: jest.fn(),
  }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/urlExtractor`,
  () => ({ downloadAudio: jest.fn() }),
)
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
  () => ({
    addAudioDuration: jest.fn(async (conversation) => {
      conversation.metadata.audio = { duration: 90 }
      return conversation
    }),
  }),
)

const { dispatchUpload, recordUpload } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/upload`,
)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const { deleteFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { addAudioDuration } = require(
  `${process.cwd()}/components/WebServer/controllers/conversation/generator`,
)

function upload(overrides = {}) {
  return {
    files: { file: { name: "meeting.wav", data: Buffer.from("audio") } },
    endpoint: "stt",
    transcriptionConfig: { enablePunctuation: true },
    headers: { "X-Organization-Id": "org-1" },
    organizationId: "org-1",
    userId: "user-1",
    ...overrides,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockCalls.length = 0
  mockSaas = true
  process.env.GATEWAY_SERVICES = "http://gateway"
})

describe("dispatchUpload", () => {
  test("checks the quota on the stored audio before paying the transcription", async () => {
    await dispatchUpload(upload())

    expect(mockCalls).toEqual(["store", "enforce", "transcribe"])
    expect(mockEnforce).toHaveBeenCalledWith({
      orgId: "org-1",
      capability: "import.minutes",
      seconds: 90,
      userId: "user-1",
    })
  })

  test("sends the audio to the endpoint with its config and headers", async () => {
    await dispatchUpload(upload())

    const [url, options] = axios.postFormData.mock.calls[0]
    expect(url).toBe("http://gateway/stt/transcribe")
    expect(options.headers).toMatchObject({ "X-Organization-Id": "org-1" })
    expect(options.formData.getBuffer().toString()).toContain(
      '{"enablePunctuation":true}',
    )
  })

  test("several files go to the multi transcription", async () => {
    const files = { file: [{ name: "a.wav", data: Buffer.from("a") }] }

    await dispatchUpload(upload({ files, isSingleFile: false }))

    expect(axios.postFormData.mock.calls[0][0]).toBe(
      "http://gateway/stt/transcribe-multi",
    )
  })

  test("returns the job, the stored file and its duration", async () => {
    await expect(dispatchUpload(upload())).resolves.toEqual({
      processingJob: { jobid: "job-1" },
      file_data: {
        filePath: "audios/stored.mp3",
        storageFilePath: "/storage/audios/stored.mp3",
        filename: "meeting.wav",
      },
      seconds: 90,
    })
  })

  test("a refused quota sends nothing and leaves no file", async () => {
    const refusal = Object.assign(new Error("Quota exceeded"), { status: 402 })
    mockEnforce.mockRejectedValueOnce(refusal)

    await expect(dispatchUpload(upload())).rejects.toBe(refusal)

    expect(axios.postFormData).not.toHaveBeenCalled()
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/stored.mp3")
  })

  test("a failed dispatch leaves no file", async () => {
    axios.postFormData.mockRejectedValueOnce(new Error("gateway down"))

    await expect(dispatchUpload(upload())).rejects.toThrow("gateway down")

    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/stored.mp3")
  })

  test("an answer without job is an error", async () => {
    axios.postFormData.mockResolvedValueOnce({})

    await expect(dispatchUpload(upload())).rejects.toMatchObject({
      status: 400,
    })
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/stored.mp3")
  })

  test("an unreadable duration does not block the upload", async () => {
    addAudioDuration.mockRejectedValueOnce(new Error("not an mp3"))

    const { seconds } = await dispatchUpload(upload())

    expect(seconds).toBe(0)
    expect(mockEnforce).toHaveBeenCalledWith(
      expect.objectContaining({ seconds: 0 }),
    )
    expect(axios.postFormData).toHaveBeenCalledTimes(1)
  })

  test("an upload that needs its duration is refused before any quota or transcription", async () => {
    addAudioDuration.mockRejectedValueOnce(new Error("not an mp3"))

    await expect(
      dispatchUpload(upload({ requireDuration: true })),
    ).rejects.toMatchObject({ status: 400 })

    expect(mockEnforce).not.toHaveBeenCalled()
    expect(axios.postFormData).not.toHaveBeenCalled()
    expect(deleteFile).toHaveBeenCalledWith("/storage/audios/stored.mp3")
  })
})

describe("dispatchUpload without the SaaS plugin", () => {
  test("does not measure an audio nobody reads", async () => {
    mockSaas = false

    const { seconds } = await dispatchUpload(upload())

    expect(addAudioDuration).not.toHaveBeenCalled()
    expect(seconds).toBe(0)
    expect(axios.postFormData).toHaveBeenCalledTimes(1)
  })

  test("still measures it when the caller needs the duration", async () => {
    mockSaas = false

    const { seconds } = await dispatchUpload(upload({ requireDuration: true }))

    expect(seconds).toBe(90)
  })
})

describe("recordUpload", () => {
  test("meters the ingested audio on import.minutes", async () => {
    await recordUpload({
      organizationId: "org-1",
      userId: "user-1",
      seconds: 90,
      ref: { conversationId: "conv-1" },
    })

    expect(mockRecord).toHaveBeenCalledWith({
      orgId: "org-1",
      userId: "user-1",
      capability: "import.minutes",
      seconds: 90,
      ref: { conversationId: "conv-1" },
    })
  })
})
