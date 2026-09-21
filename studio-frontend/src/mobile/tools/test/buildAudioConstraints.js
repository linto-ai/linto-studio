import test from "ava"
import { buildAudioConstraints } from "../buildAudioConstraints.js"

test("buildAudioConstraints() pins an explicit device", (t) => {
  const constraints = buildAudioConstraints("abc")
  t.deepEqual(constraints.audio.deviceId, { exact: "abc" })
  t.is(constraints.audio.channelCount, 1)
})

test("buildAudioConstraints() leaves the default input unpinned", (t) => {
  t.is(buildAudioConstraints(null).audio.deviceId, undefined)
  t.is(buildAudioConstraints("default").audio.deviceId, undefined)
})
