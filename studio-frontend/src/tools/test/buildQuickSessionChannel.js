import test from "ava"
import { buildQuickSessionChannel } from "../buildQuickSessionChannel.js"

const profile = { id: 7, translations: ["en"] }
const service = { serviceName: "whisper" }

test("live with a profile: the profile and its translations go on the channel", (t) => {
  const channel = buildQuickSessionChannel({
    subInStudio: true,
    selectedProfile: profile,
    offlineTranscription: false,
    keepAudio: false,
    transcriptionService: service,
  })
  t.is(channel.transcriberProfileId, 7)
  t.deepEqual(channel.translations, ["en"])
  t.true(channel.enableLiveTranscripts)
  t.true(channel.compressAudio)
  t.false(channel.keepAudio)
})

test("live off: audio-only channel, no profile even if one is selected", (t) => {
  const channel = buildQuickSessionChannel({
    subInStudio: false,
    selectedProfile: profile,
    offlineTranscription: true,
    keepAudio: false,
    transcriptionService: service,
  })
  t.false("transcriberProfileId" in channel)
  t.false("translations" in channel)
  t.false(channel.enableLiveTranscripts)
  t.false(channel.compressAudio)
  t.true(channel.keepAudio)
  t.deepEqual(channel.meta, { transcriptionService: service })
})

test("live and offline: profile on the channel and audio kept uncompressed", (t) => {
  const channel = buildQuickSessionChannel({
    subInStudio: true,
    selectedProfile: { id: 3 },
    offlineTranscription: true,
    keepAudio: true,
    transcriptionService: service,
  })
  t.is(channel.transcriberProfileId, 3)
  t.deepEqual(channel.translations, [])
  t.true(channel.enableLiveTranscripts)
  t.false(channel.compressAudio)
  t.true(channel.keepAudio)
})

test("no profile available: live cannot be on", (t) => {
  const channel = buildQuickSessionChannel({
    subInStudio: true,
    selectedProfile: null,
    offlineTranscription: true,
    transcriptionService: service,
  })
  t.false(channel.enableLiveTranscripts)
  t.false("transcriberProfileId" in channel)
})
