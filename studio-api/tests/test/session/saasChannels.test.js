const {
  isLiveChannel,
  isOfflineChannel,
  liveLanguages,
  offlineMinutes,
} = require(
  `${process.cwd()}/components/WebServer/controllers/session/saasChannels.js`,
)

const service = { transcriptionService: { serviceName: "whisper" } }
const live = (extra = {}) => ({
  transcriberProfileId: 1,
  compressAudio: true,
  keepAudio: true,
  ...extra,
})
const audioOnly = (extra = {}) => ({
  keepAudio: true,
  compressAudio: true,
  meta: service,
  ...extra,
})
const reqOf = (channels) => ({ body: { channels } })

describe("saasChannels: what a quickMeeting channel costs", () => {
  test("live needs a profile that transcribes", () => {
    expect(isLiveChannel(live())).toBe(true)
    expect(isLiveChannel(live({ enableLiveTranscripts: false }))).toBe(false)
    expect(isLiveChannel(audioOnly())).toBe(false)
    expect(isLiveChannel(null)).toBe(false)
  })

  test("offline is kept uncompressed audio with a transcription service", () => {
    expect(isOfflineChannel(audioOnly())).toBe(true)
    expect(
      isOfflineChannel(live({ compressAudio: false, meta: service })),
    ).toBe(true)
    expect(isOfflineChannel(live({ meta: service }))).toBe(false)
    expect(isOfflineChannel(audioOnly({ keepAudio: false }))).toBe(false)
    expect(isOfflineChannel(audioOnly({ meta: {} }))).toBe(false)
  })

  test("record-only session: no live admission, one import minute", () => {
    const req = reqOf([audioOnly({ translations: ["en"] })])
    expect(liveLanguages(req)).toBe(0)
    expect(offlineMinutes(req)).toBe(1)
  })

  test("live session: languages per live channel, nothing offline", () => {
    const req = reqOf([live({ translations: ["en", "de"] }), live()])
    expect(liveLanguages(req)).toBe(4)
    expect(offlineMinutes(req)).toBe(0)
  })

  test("live plus offline: one credit stream and the import quota", () => {
    const req = reqOf([live({ compressAudio: false, meta: service })])
    expect(liveLanguages(req)).toBe(1)
    expect(offlineMinutes(req)).toBe(1)
  })

  test("a profile with live switched off is not a stream", () => {
    const req = reqOf([
      live({ enableLiveTranscripts: false, translations: ["en"] }),
    ])
    expect(liveLanguages(req)).toBe(0)
  })

  test("no channels asks nothing", () => {
    expect(liveLanguages({ body: {} })).toBe(0)
    expect(offlineMinutes({})).toBe(0)
  })
})
