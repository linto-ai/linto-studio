import test from "ava"
import { buildLiveChannel } from "../buildLiveChannel.js"

const profile = { id: "p1" }

test("buildLiveChannel() keeps compressed audio without an offline pass", (t) => {
  const channel = buildLiveChannel({
    profile,
    translations: ["en-US"],
    keepAudio: true,
    diarization: false,
  })
  t.is(channel.transcriberProfileId, "p1")
  t.true(channel.enableLiveTranscripts)
  t.true(channel.keepAudio)
  t.true(channel.compressAudio)
  t.deepEqual(channel.translations, ["en-US"])
  t.is(channel.meta.transcriptionService, null)
})

test("buildLiveChannel() can drop the audio and enable live diarization", (t) => {
  const channel = buildLiveChannel({
    profile,
    translations: [],
    keepAudio: false,
    diarization: true,
  })
  t.false(channel.keepAudio)
  t.true(channel.diarization)
})
