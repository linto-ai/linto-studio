import test from "ava"
import { buildLiveChannel } from "../buildLiveChannel.js"

const profile = { id: "p1" }
const service = { serviceName: "whisper" }

test("buildLiveChannel() keeps the audio uncompressed when a Whisper pass follows", (t) => {
  const channel = buildLiveChannel({
    profile,
    translations: ["en-US"],
    keepAudio: true,
    transcriptionService: service,
    diarization: false,
  })
  t.is(channel.transcriberProfileId, "p1")
  t.true(channel.enableLiveTranscripts)
  t.true(channel.keepAudio)
  t.false(channel.compressAudio)
  t.deepEqual(channel.translations, ["en-US"])
  t.is(channel.meta.transcriptionService, service)
})

test("buildLiveChannel() compresses and skips the offline pass without a service", (t) => {
  const channel = buildLiveChannel({
    profile,
    translations: [],
    keepAudio: true,
    transcriptionService: null,
    diarization: true,
  })
  t.true(channel.compressAudio)
  t.is(channel.meta.transcriptionService, null)
  t.true(channel.diarization)
})

test("buildLiveChannel() drops the offline pass when audio is not kept", (t) => {
  const channel = buildLiveChannel({
    profile,
    translations: [],
    keepAudio: false,
    transcriptionService: service,
    diarization: false,
  })
  t.false(channel.keepAudio)
  t.true(channel.compressAudio)
  t.is(channel.meta.transcriptionService, null)
})
