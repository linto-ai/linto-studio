import test from "ava"
import { isRecordingQuiet } from "../isRecordingQuiet.js"

test("isRecordingQuiet() flags a flat meter", (t) => {
  t.true(isRecordingQuiet({ peakLevel: 0.02 }))
  t.false(isRecordingQuiet({ peakLevel: 0.4 }))
})

test("isRecordingQuiet() ignores recordings without a measured peak", (t) => {
  t.false(isRecordingQuiet({}))
  t.false(isRecordingQuiet(null))
})
