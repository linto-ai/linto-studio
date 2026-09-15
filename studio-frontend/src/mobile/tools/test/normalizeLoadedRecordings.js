import test from "ava"
import { normalizeLoadedRecordings } from "../normalizeLoadedRecordings.js"

test("normalizeLoadedRecordings() queues legacy kept items and stale recordings", (t) => {
  const { keep, remove } = normalizeLoadedRecordings([
    { id: "a", status: "ready" },
    { id: "b", status: "recording", sizeBytes: 1200 },
    { id: "c", status: "recording", sizeBytes: 0 },
    { id: "d", status: "uploaded" },
    { id: "e", status: "naming" },
  ])
  t.deepEqual(
    keep.map((r) => [r.id, r.status]),
    [
      ["a", "queued"],
      ["b", "queued"],
      ["d", "uploaded"],
      ["e", "queued"],
    ],
  )
  t.true(keep[1].interruptedAt > 0)
  t.deepEqual(remove, ["c"])
})
