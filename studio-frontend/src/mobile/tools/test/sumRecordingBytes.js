import test from "ava"
import { sumRecordingBytes } from "../sumRecordingBytes.js"

test("sumRecordingBytes() adds sizes, missing ones count as zero", (t) => {
  t.is(sumRecordingBytes([{ sizeBytes: 10 }, {}, { sizeBytes: 5 }]), 15)
  t.is(sumRecordingBytes([]), 0)
})
