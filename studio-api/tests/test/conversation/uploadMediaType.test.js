// The declared type only rejects what is explicitly not audio or video; a generic
// one (API upload without a file name) is left to the probe of the content.
const fs = require("fs")
const os = require("os")
const path = require("path")

const mockHasAudioStream = jest.fn()
jest.mock(
  `${process.cwd()}/components/WebServer/controllers/files/transform`,
  () => ({
    transformAudio: jest.fn(async (input, output) =>
      require("fs").writeFileSync(output, ""),
    ),
    mergeAudio: jest.fn(),
    hasAudioStream: (filePath) => mockHasAudioStream(filePath),
    convertToFlac: jest.fn(),
    probeAudioDuration: jest.fn(),
  }),
)

const { storeFile, STORE_TYPE } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

let volume

beforeEach(() => {
  mockHasAudioStream.mockReset()
  mockHasAudioStream.mockResolvedValue(true)
  volume = fs.mkdtempSync(path.join(os.tmpdir(), "upload-media-"))
  process.env.VOLUME_FOLDER = volume
  process.env.VOLUME_AUDIO_PATH = "audios"
  fs.mkdirSync(path.join(volume, "audios"))
})

afterEach(() => {
  fs.rmSync(volume, { recursive: true, force: true })
})

function upload(name, mimetype) {
  return { name, mimetype, data: Buffer.from("audio") }
}

describe("storeFile media type", () => {
  test("accepts an octet-stream upload without extension once probed", async () => {
    const stored = await storeFile(
      upload("file", "application/octet-stream"),
      STORE_TYPE.AUDIO,
    )
    expect(mockHasAudioStream).toHaveBeenCalledTimes(1)
    expect(fs.existsSync(stored.storageFilePath)).toBe(true)
  })

  test("accepts an upload without declared type once probed", async () => {
    await storeFile(upload("file", undefined), STORE_TYPE.AUDIO)
    expect(mockHasAudioStream).toHaveBeenCalledTimes(1)
  })

  test("still rejects a generic upload whose content has no audio", async () => {
    mockHasAudioStream.mockResolvedValue(false)
    await expect(
      storeFile(upload("file", "application/octet-stream"), STORE_TYPE.AUDIO),
    ).rejects.toMatchObject({ status: 415 })
    expect(fs.readdirSync(path.join(volume, "audios"))).toEqual([])
  })

  test("rejects an explicit non-media type without probing", async () => {
    await expect(
      storeFile(upload("report.pdf", "application/pdf"), STORE_TYPE.AUDIO),
    ).rejects.toMatchObject({ status: 415 })
    expect(mockHasAudioStream).not.toHaveBeenCalled()
  })
})
