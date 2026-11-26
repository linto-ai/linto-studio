import test from "ava"
import { locateNativeAudioFile } from "../locateNativeAudioFile.ts"

const IOS_CONTAINER =
  "file:///private/var/mobile/Containers/Data/Application/0F1E2D3C"

test("locateNativeAudioFile() finds a kept recording in the app's files", (t) => {
  t.deepEqual(
    locateNativeAudioFile(
      "file:///data/user/0/ai.linto.studio/files/recordings/a.aac",
    ),
    { directory: "DATA", path: "recordings/a.aac" },
  )
})

test("locateNativeAudioFile() finds the Android recorder's file in the cache", (t) => {
  t.deepEqual(
    locateNativeAudioFile(
      "file:///data/user/0/ai.linto.studio/cache/capacitor-audio-recorder/b.aac",
    ),
    { directory: "CACHE", path: "capacitor-audio-recorder/b.aac" },
  )
})

test("locateNativeAudioFile() finds the iOS recorder's file in tmp", (t) => {
  t.deepEqual(
    locateNativeAudioFile(`${IOS_CONTAINER}/tmp/CapacitorAudioRecorder/c.aac`),
    { directory: "TEMPORARY", path: "CapacitorAudioRecorder/c.aac" },
  )
})

test("locateNativeAudioFile() drops the container path that changes on iOS", (t) => {
  const before = locateNativeAudioFile(
    `${IOS_CONTAINER}/Documents/recordings/d.aac`,
  )
  const after = locateNativeAudioFile(
    "file:///private/var/mobile/Containers/Data/Application/9A8B7C6D/Documents/recordings/d.aac",
  )
  t.deepEqual(before, after)
})

test("locateNativeAudioFile() decodes the file's name", (t) => {
  t.deepEqual(locateNativeAudioFile("file:///x/recordings/my%20file.aac"), {
    directory: "DATA",
    path: "recordings/my file.aac",
  })
})

test("locateNativeAudioFile() gives null outside the known folders", (t) => {
  t.is(locateNativeAudioFile("file:///x/elsewhere/e.aac"), null)
})

test("locateNativeAudioFile() gives null without a URI", (t) => {
  t.is(locateNativeAudioFile(null), null)
  t.is(locateNativeAudioFile(""), null)
  t.is(locateNativeAudioFile("file:///x/recordings/"), null)
})
