// Session recordings live on the volume shared with the Session API as
// <sessionId>-<channelId>.<ext>; studio-api drops the ones no conversation uses.
const fs = require("fs")
const os = require("os")
const path = require("path")

const mockReferenced = new Set()
jest.mock(`${process.cwd()}/lib/mongodb/models`, () => ({
  conversations: {
    countByAudioFilepath: jest.fn(async (filepath) =>
      mockReferenced.has(filepath) ? 1 : 0,
    ),
  },
}))

const { deleteSessionAudioFiles } = require(
  `${process.cwd()}/components/WebServer/controllers/files/store`,
)

let volume

beforeEach(() => {
  mockReferenced.clear()
  volume = fs.mkdtempSync(path.join(os.tmpdir(), "session-audio-"))
  process.env.VOLUME_FOLDER = volume
  process.env.VOLUME_AUDIO_SESSION_PATH = "session_audio"
  fs.mkdirSync(path.join(volume, "session_audio"))
  for (const name of [
    "sess-1-0.wav",
    "sess-1-1.mp3",
    "sess-1-2.mp3",
    "sess-10-0.mp3",
    "other-0.mp3",
  ]) {
    fs.writeFileSync(path.join(volume, "session_audio", name), "")
  }
})

afterEach(() => {
  fs.rmSync(volume, { recursive: true, force: true })
})

function remaining() {
  return fs.readdirSync(path.join(volume, "session_audio")).sort()
}

describe("deleteSessionAudioFiles", () => {
  test("drops every unused recording of the session and nothing else", async () => {
    await deleteSessionAudioFiles("sess-1")
    expect(remaining()).toEqual(["other-0.mp3", "sess-10-0.mp3"])
  })

  test("spares the recordings a conversation still points to", async () => {
    mockReferenced.add("session_audio/sess-1-0.wav")
    await deleteSessionAudioFiles("sess-1")
    expect(remaining()).toEqual([
      "other-0.mp3",
      "sess-1-0.wav",
      "sess-10-0.mp3",
    ])
  })

  test("is a no-op without a session id or without the folder", async () => {
    await deleteSessionAudioFiles(undefined)
    process.env.VOLUME_AUDIO_SESSION_PATH = "missing"
    await deleteSessionAudioFiles("sess-1")
    process.env.VOLUME_AUDIO_SESSION_PATH = "session_audio"
    expect(remaining()).toHaveLength(5)
  })
})
