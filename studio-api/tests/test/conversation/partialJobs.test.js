// A conversation open to append has one transcription job per part: whatever
// the order the jobs finish in, the parts are merged in their arrival order,
// in the audio as in the transcription.

// music-metadata is ESM-only, not loadable by Jest
jest.mock("music-metadata", () => ({ parseStream: jest.fn() }), {
  virtual: true,
})

let mockDoc
let mockJobs
let mockResults
const mockDurations = { "audios/a+b.mp3": 30, "audios/a+b+c.mp3": 35 }

// Same guards as the real model, on a document kept in memory
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    getById: jest.fn(async () => [structuredClone(mockDoc)]),
    updatePart: jest.fn(async (_id, partId, state, values, content = {}) => {
      const part = mockDoc.jobs.transcription.parts.find(
        (candidate) => candidate.id === partId && candidate.state === state,
      )
      if (!part) return { matchedCount: 0 }
      Object.assign(part, values)
      if (content.text) {
        mockDoc.speakers.push(...content.speakers)
        mockDoc.text.push(...content.text)
      }
      return { matchedCount: 1 }
    }),
    removePart: jest.fn(async (_id, partId) => {
      const parts = mockDoc.jobs.transcription.parts
      const index = parts.findIndex(
        (part) => part.id === partId && part.state === "uploading",
      )
      if (index === -1) return { modifiedCount: 0 }
      parts.splice(index, 1)
      return { modifiedCount: 1 }
    }),
    joinPart: jest.fn(async (_id, partId, previousFilepath, metadata) => {
      const part = mockDoc.jobs.transcription.parts.find(
        (candidate) => candidate.id === partId && candidate.filepath,
      )
      if (!part || mockDoc.metadata.audio.filepath !== previousFilepath) {
        return { matchedCount: 0 }
      }
      mockDoc.metadata.audio = { ...metadata.audio }
      delete part.filepath
      return { matchedCount: 1 }
    }),
    update: jest.fn(async (payload) => {
      const job = mockDoc.jobs.transcription
      if (payload["jobs.transcription.job_logs"]) {
        job.job_logs = payload["jobs.transcription.job_logs"]
      }
      if (payload["jobs.transcription.state"]) {
        job.state = payload["jobs.transcription.state"]
      }
      return { matchedCount: 1 }
    }),
    updateJob: jest.fn(async () => ({ matchedCount: 1 })),
  },
}))

jest.mock(`${process.cwd()}/lib/utility/axios`, () => ({
  get: jest.fn(async (url) => {
    const [, kind, id] = url.match(/\/(job|job-log|results)\/([^/?]+)/)
    if (kind === "job") {
      if (!mockJobs[id]) throw new Error("unknown job")
      return mockJobs[id]
    }
    if (kind === "results") return mockResults[id]
    return `logs of ${id}`
  }),
}))

jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
  () => ({
    joinAudio: jest.fn(async (filepaths, filename) => {
      const joined = filepaths
        .map((filepath) => filepath.match(/audios\/(.+)\.mp3/)[1])
        .join("+")
      return {
        filePath: `audios/${joined}.mp3`,
        storageFilePath: `/storage/audios/${joined}.mp3`,
        filename,
      }
    }),
    deleteFile: jest.fn(),
    deleteAudioFileIfOrphaned: jest.fn(async () => {}),
    getStorageFolder: () => "/storage",
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
        duration: mockDurations[file.filePath],
        mimetype: "audio/mpeg",
        filepath: file.filePath,
      }
      conversation.metadata.file = {}
      return conversation
    }),
  }),
)

const { fetchJob } = require(
  `${process.cwd()}/components/WebServer/controllers/job/fetchHandler`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const axios = require(`${process.cwd()}/lib/utility/axios`)
const store = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

// A part holds a filepath until it is joined to the audio of the conversation
function part(id, duration, joined = false) {
  const queued = {
    id,
    job_id: `job-${id}`,
    filepath: `audios/${id}.mp3`,
    duration,
    state: "pending",
    created: new Date().toISOString(),
  }
  if (joined) delete queued.filepath
  return queued
}

function uploading(id, created = new Date().toISOString()) {
  return { id, state: "uploading", created }
}

// One turn of one word, said by `speaker` one second after the part starts
function transcription(word, speaker = "spk1") {
  return {
    transcription_result: word,
    confidence: 1,
    segments: [
      {
        spk_id: speaker,
        start: 1,
        end: 2,
        duration: 1,
        raw_segment: word,
        segment: word,
        words: [{ word, start: 1, end: 2, conf: 1 }],
      },
    ],
  }
}

function jobDone(id, word, speaker) {
  mockJobs[`job-${id}`] = { state: "done", result_id: `result-${id}` }
  mockResults[`result-${id}`] = transcription(word, speaker)
}

function jobRunning(id) {
  mockJobs[`job-${id}`] = { state: "started" }
}

function words() {
  return mockDoc.text.map((turn) => turn.words[0].word)
}

function starts() {
  return mockDoc.text.map((turn) => turn.words[0].stime)
}

async function poll() {
  return await fetchJob("conv-1", structuredClone(mockDoc.jobs))
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.GATEWAY_SERVICES = "http://gateway"
  mockJobs = {}
  mockResults = {}
  mockDoc = {
    _id: "conv-1",
    locale: "fr-FR",
    speakers: [],
    text: [],
    metadata: {
      transcription: { endpoint: "stt", lang: "fr-FR", transcriptionConfig: {} },
      normalize: { filter: {} },
      audio: { filename: "meeting.wav", filepath: "audios/a.mp3", duration: 10 },
    },
    jobs: {
      transcription: {
        state: "pending",
        endpoint: "stt",
        partial: true,
        parts: [part("a", 10, true), part("b", 20), part("c", 5)],
      },
      keyword: {},
    },
  }
})

describe("parts are merged in their arrival order", () => {
  test("a running part holds the next ones, even already transcribed", async () => {
    jobRunning("a")
    jobDone("b", "deux")
    jobDone("c", "trois")

    await poll()

    expect(words()).toEqual([])
    expect(mockDoc.jobs.transcription.parts.map((p) => p.state)).toEqual([
      "pending",
      "pending",
      "pending",
    ])
  })

  test("jobs finishing in reverse order still give the arrival order", async () => {
    jobRunning("a")
    jobRunning("b")
    jobDone("c", "trois")
    await poll()

    jobDone("b", "deux")
    await poll()
    expect(words()).toEqual([])

    jobDone("a", "un")
    await poll()

    expect(words()).toEqual(["un", "deux", "trois"])
    // Each part starts where the previous ones end: 0, 10 and 10 + 20
    expect(starts()).toEqual([1, 11, 31])
  })

  test("merges what is ready and resumes at the next poll", async () => {
    jobDone("a", "un")
    jobRunning("b")
    jobDone("c", "trois")
    await poll()
    expect(words()).toEqual(["un"])

    jobDone("b", "deux")
    await poll()
    expect(words()).toEqual(["un", "deux", "trois"])
    expect(starts()).toEqual([1, 11, 31])
  })

  test("a part is never merged twice", async () => {
    jobDone("a", "un")
    jobDone("b", "deux")
    jobDone("c", "trois")

    await poll()
    await poll()

    expect(words()).toEqual(["un", "deux", "trois"])
  })

  test("stops when a part was merged by another replica meanwhile", async () => {
    jobDone("a", "un")
    jobDone("b", "deux")
    jobDone("c", "trois")
    model.conversations.updatePart.mockResolvedValueOnce({ matchedCount: 0 })

    await poll()
    expect(words()).toEqual([])

    await poll()
    expect(words()).toEqual(["un", "deux", "trois"])
  })
})

describe("speakers across parts", () => {
  test("a speaker of the same name is the same speaker", async () => {
    jobDone("a", "un", "spk1")
    jobDone("b", "deux", "spk2")
    jobDone("c", "trois", "spk1")

    await poll()

    expect(mockDoc.speakers.map((s) => s.speaker_name)).toEqual([
      "spk1",
      "spk2",
    ])
    expect(mockDoc.text[2].speaker_id).toBe(mockDoc.text[0].speaker_id)
    expect(mockDoc.text[1].speaker_id).toBe(mockDoc.speakers[1].speaker_id)
    // A speaker appears where its part is in the whole audio
    expect(mockDoc.speakers[1].stime).toBe(11)
  })
})

describe("parts that never get a transcription", () => {
  test("a part being uploaded holds the next ones", async () => {
    jobDone("a", "un")
    mockDoc.jobs.transcription.parts[1] = uploading("b")
    jobDone("c", "trois")

    await poll()

    expect(words()).toEqual(["un"])
    expect(model.conversations.removePart).not.toHaveBeenCalled()
  })

  test("an abandoned upload leaves the queue and frees the next ones", async () => {
    jobDone("a", "un")
    mockDoc.jobs.transcription.parts[1] = uploading(
      "b",
      "2020-01-01T00:00:00.000Z",
    )
    jobDone("c", "trois")

    await poll()

    expect(mockDoc.jobs.transcription.parts.map((p) => p.id)).toEqual([
      "a",
      "c",
    ])
    expect(words()).toEqual(["un", "trois"])
    // The dropped part takes no room in the audio
    expect(starts()).toEqual([1, 11])
  })

  test("a failed job leaves a gap and lets the next parts in", async () => {
    jobDone("a", "un")
    mockJobs["job-b"] = { state: "error" }
    jobDone("c", "trois")

    await poll()

    expect(mockDoc.jobs.transcription.parts.map((p) => p.state)).toEqual([
      "done",
      "error",
      "done",
    ])
    expect(words()).toEqual(["un", "trois"])
    // The failed part keeps its room in the audio
    expect(starts()).toEqual([1, 31])
    expect(mockDoc.jobs.transcription.job_logs).toBe("logs of job-b")
  })

  test("a silent part is merged without text", async () => {
    jobDone("a", "un")
    mockJobs["job-b"] = { state: "done", result_id: "result-b" }
    mockResults["result-b"] = { transcription_result: "", segments: [] }
    jobDone("c", "trois")

    await poll()

    expect(mockDoc.jobs.transcription.parts[1].state).toBe("done")
    expect(words()).toEqual(["un", "trois"])
    expect(starts()).toEqual([1, 31])
  })
})

describe("the audio of the conversation", () => {
  beforeEach(() => {
    jobRunning("a")
    jobRunning("b")
    jobRunning("c")
  })

  test("appended audios are joined in their arrival order, before any transcription", async () => {
    await poll()

    expect(store.joinAudio.mock.calls).toEqual([
      [["audios/a.mp3", "audios/b.mp3"], "meeting.wav"],
      [["audios/a+b.mp3", "audios/c.mp3"], "meeting.wav"],
    ])
    expect(mockDoc.metadata.audio).toMatchObject({
      filepath: "audios/a+b+c.mp3",
      duration: 35,
      filename: "meeting.wav",
    })
    expect(mockDoc.jobs.transcription.parts.map((p) => p.filepath)).toEqual([
      undefined,
      undefined,
      undefined,
    ])
  })

  test("the joined files are removed, the last audio is kept", async () => {
    await poll()

    // The audio it replaces may be shared with a duplicate, a part never is
    expect(
      store.deleteAudioFileIfOrphaned.mock.calls.map(([filepath]) => filepath),
    ).toEqual(["audios/a.mp3", "audios/a+b.mp3"])
    expect(store.deleteFile.mock.calls.map(([filepath]) => filepath)).toEqual([
      "/storage/audios/b.mp3",
      "/storage/audios/c.mp3",
    ])
  })

  test("is joined once", async () => {
    await poll()
    await poll()

    expect(store.joinAudio).toHaveBeenCalledTimes(2)
  })

  test("an audio being uploaded holds the next ones", async () => {
    mockDoc.jobs.transcription.parts[1] = uploading("b")

    await poll()

    expect(store.joinAudio).not.toHaveBeenCalled()
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a.mp3")
    expect(mockDoc.jobs.transcription.parts[2].filepath).toBe("audios/c.mp3")
  })

  test("an abandoned upload is dropped and the next audio joined", async () => {
    mockDoc.jobs.transcription.parts[1] = uploading(
      "b",
      "2020-01-01T00:00:00.000Z",
    )

    await poll()

    expect(store.joinAudio.mock.calls).toEqual([
      [["audios/a.mp3", "audios/c.mp3"], "meeting.wav"],
    ])
  })

  test("joined by another replica meanwhile: its own file is dropped", async () => {
    model.conversations.joinPart.mockResolvedValueOnce({ matchedCount: 0 })

    await poll()

    expect(store.joinAudio).toHaveBeenCalledTimes(1)
    expect(store.deleteFile).toHaveBeenCalledWith("/storage/audios/a+b.mp3")
    expect(store.deleteAudioFileIfOrphaned).not.toHaveBeenCalled()
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a.mp3")
  })

  test("a failed join is retried and does not hold the transcription", async () => {
    store.joinAudio.mockRejectedValueOnce(new Error("ffmpeg exited with code 1"))
    jobDone("a", "un")
    jobDone("b", "deux")
    jobDone("c", "trois")

    await poll()
    expect(words()).toEqual(["un", "deux", "trois"])
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a.mp3")

    await poll()
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a+b+c.mp3")
  })
})

describe("closing the conversation", () => {
  beforeEach(() => {
    jobDone("a", "un")
    jobDone("b", "deux")
    jobDone("c", "trois")
  })

  test("stays pending while it is open to append", async () => {
    const result = await poll()

    expect(words()).toEqual(["un", "deux", "trois"])
    expect(mockDoc.jobs.transcription.state).toBe("pending")
    expect(result.conv_job.transcription.state).toBe("pending")
  })

  test("once completed and everything merged, it is done", async () => {
    await poll()
    mockDoc.jobs.transcription.partial = false

    const result = await poll()

    expect(mockDoc.jobs.transcription.state).toBe("done")
    expect(result.conv_job.transcription.state).toBe("done")
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a+b+c.mp3")
  })

  test("completed before the last transcription: closes when it is merged", async () => {
    jobRunning("c")
    mockDoc.jobs.transcription.partial = false

    await poll()
    expect(mockDoc.jobs.transcription.state).toBe("pending")

    jobDone("c", "trois")
    await poll()
    expect(mockDoc.jobs.transcription.state).toBe("done")
    expect(words()).toEqual(["un", "deux", "trois"])
  })

  test("a part still being uploaded keeps it open once completed", async () => {
    mockDoc.jobs.transcription.partial = false
    mockDoc.jobs.transcription.parts.push(uploading("d"))

    await poll()

    expect(mockDoc.jobs.transcription.state).toBe("pending")
  })

  test("an audio that could not be joined keeps it pending", async () => {
    store.joinAudio.mockRejectedValueOnce(new Error("ffmpeg exited with code 1"))
    mockDoc.jobs.transcription.partial = false

    await poll()
    expect(words()).toEqual(["un", "deux", "trois"])
    expect(mockDoc.jobs.transcription.state).toBe("pending")

    await poll()
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a+b+c.mp3")
    expect(mockDoc.jobs.transcription.state).toBe("done")
  })

  test("a failed part closes it in error, with the whole audio", async () => {
    mockJobs["job-b"] = { state: "error" }
    mockDoc.jobs.transcription.partial = false

    await poll()

    expect(mockDoc.jobs.transcription.state).toBe("error")
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a+b+c.mp3")
  })

  test("never appended: the uploaded audio is kept as is", async () => {
    mockDoc.jobs.transcription.parts = [part("a", 10, true)]
    mockDoc.jobs.transcription.partial = false

    await poll()

    expect(mockDoc.jobs.transcription.state).toBe("done")
    expect(store.joinAudio).not.toHaveBeenCalled()
    expect(store.deleteAudioFileIfOrphaned).not.toHaveBeenCalled()
    expect(mockDoc.metadata.audio.filepath).toBe("audios/a.mp3")
  })

  test("a closed conversation is not polled anymore", async () => {
    mockDoc.jobs.transcription.partial = false
    await poll()
    jest.clearAllMocks()

    await poll()

    expect(model.conversations.getById).not.toHaveBeenCalled()
    expect(axios.get).not.toHaveBeenCalled()
  })
})

describe("a regular conversation", () => {
  test("keeps its single job polling", async () => {
    mockJobs["job-1"] = { state: "started" }

    const result = await fetchJob("conv-2", {
      transcription: { job_id: "job-1", state: "pending", endpoint: "stt" },
      keyword: {},
    })

    expect(axios.get).toHaveBeenCalledWith("http://gateway/stt/job/job-1")
    expect(model.conversations.updateJob).toHaveBeenCalledTimes(1)
    expect(result.conv_job.transcription.state).toBe("started")
  })
})
