import test from "ava"
import { mergeRecordingPatch } from "../mergeRecordingPatch.ts"

const recording = {
  id: "rec-1",
  name: "Meeting",
  status: "recording",
  audio: { sizeBytes: 10, durationMs: 1000, gaps: [] },
  conversation: { id: null, sendProgress: 0 },
}

test("mergeRecordingPatch() replaces top-level fields and merges the parts", (t) => {
  const merged = mergeRecordingPatch(recording, {
    status: "naming",
    audio: { sizeBytes: 20 },
    conversation: { id: "conv-1" },
  })
  t.deepEqual(merged, {
    id: "rec-1",
    name: "Meeting",
    status: "naming",
    audio: { sizeBytes: 20, durationMs: 1000, gaps: [] },
    conversation: { id: "conv-1", sendProgress: 0 },
  })
})

test("mergeRecordingPatch() leaves the row as it was", (t) => {
  mergeRecordingPatch(recording, { audio: { sizeBytes: 99 } })
  t.is(recording.audio.sizeBytes, 10)
})
