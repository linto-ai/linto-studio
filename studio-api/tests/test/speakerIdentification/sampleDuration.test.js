jest.mock("debug", () => () => () => {})
// The enrolment module loads the Mongo models; none is used by these tests.
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  speakerIdSyncOps: { SYNC_OP: {} },
}))

const fs = require("fs")
const os = require("os")
const path = require("path")

const { checkSampleDuration } = require(
  `${process.cwd()}/components/WebServer/controllers/speakerIdentification/enrolment`,
)
const { validateAudioFile } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)
const { probeAudioDuration } = require(
  `${process.cwd()}/components/WebServer/controllers/files/transform`,
)
const { VoiceSampleError } = require(
  `${process.cwd()}/components/WebServer/error/exception/speakerIdentification`,
)

const WAV_FIXTURE = `${process.cwd()}/tests/data/audio/audio.wav`

describe("checkSampleDuration", () => {
  beforeEach(() => {
    delete process.env.SPEAKER_ID_MIN_SAMPLE_DURATION
    delete process.env.SPEAKER_ID_MAX_TOTAL_DURATION_PER_LABEL
  })

  test("rejects a sample shorter than the minimum with a 400 error", () => {
    let thrown
    try {
      checkSampleDuration(12.4, 0, VoiceSampleError)
    } catch (err) {
      thrown = err
    }
    expect(thrown).toBeInstanceOf(VoiceSampleError)
    expect(thrown.status).toBe(400)
    expect(thrown.message).toContain("12s")
    expect(thrown.message).toContain("20s")
  })

  test("accepts a sample at the minimum", () => {
    expect(() => checkSampleDuration(20, 0, VoiceSampleError)).not.toThrow()
  })

  test("rejects a sample that pushes the speaker over the total", () => {
    expect(() => checkSampleDuration(30, 580, VoiceSampleError)).toThrow("600s")
  })

  test("reads the limits from the environment", () => {
    process.env.SPEAKER_ID_MIN_SAMPLE_DURATION = "5"
    expect(() => checkSampleDuration(6, 0, VoiceSampleError)).not.toThrow()
  })

  test("skips an unknown duration", () => {
    expect(() =>
      checkSampleDuration(undefined, 590, VoiceSampleError),
    ).not.toThrow()
  })
})

describe("probeAudioDuration", () => {
  let dir

  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "voice-sample-"))
  })

  afterAll(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  test("reads the duration of a wav file", async () => {
    expect(await probeAudioDuration(WAV_FIXTURE)).toBeCloseTo(2.7, 1)
  })

  test("rejects an unreadable or missing file", async () => {
    const filePath = path.join(dir, "garbage.wav")
    fs.writeFileSync(filePath, "not audio")
    await expect(probeAudioDuration(filePath)).rejects.toThrow()
    await expect(
      probeAudioDuration(path.join(dir, "missing.wav")),
    ).rejects.toThrow()
  })
})

describe("validateAudioFile", () => {
  const MB = 1024 * 1024

  test("rejects a sample above the default 10 MB limit", () => {
    expect(() =>
      validateAudioFile(
        { mimetype: "audio/wav", size: 10 * MB + 1 },
        VoiceSampleError,
        VoiceSampleError,
      ),
    ).toThrow("Maximum size: 10MB")
  })

  test("accepts a sample at the limit", () => {
    expect(() =>
      validateAudioFile(
        { mimetype: "audio/wav", size: 10 * MB },
        VoiceSampleError,
        VoiceSampleError,
      ),
    ).not.toThrow()
  })
})
