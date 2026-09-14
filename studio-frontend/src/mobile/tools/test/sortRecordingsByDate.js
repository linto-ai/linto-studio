import test from "ava"
import { sortRecordingsByDate } from "../sortRecordingsByDate.js"

test("sortRecordingsByDate() puts the newest first and keeps the input intact", (t) => {
  const input = [{ createdAt: 1 }, { createdAt: 3 }, { createdAt: 2 }]
  const sorted = sortRecordingsByDate(input)
  t.deepEqual(
    sorted.map((r) => r.createdAt),
    [3, 2, 1],
  )
  t.deepEqual(
    input.map((r) => r.createdAt),
    [1, 3, 2],
  )
})
