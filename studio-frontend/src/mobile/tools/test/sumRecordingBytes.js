import test from "ava"
import { sumRecordingBytes } from "../sumRecordingBytes.js"

test("sumRecordingBytes() adds the sizes of the audio", (t) => {
  const recordings = [10, 0, 5].map((sizeBytes) => ({ audio: { sizeBytes } }))
  t.is(sumRecordingBytes(recordings), 15)
  t.is(sumRecordingBytes([]), 0)
})
