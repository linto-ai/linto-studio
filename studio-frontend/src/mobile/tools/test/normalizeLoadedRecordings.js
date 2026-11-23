import test from "ava"
import { normalizeLoadedRecordings } from "../normalizeLoadedRecordings.ts"

function row(
  id,
  status,
  { sizeBytes = 0, durationMs = 0, sendProgress = 0 } = {},
) {
  return {
    id,
    status,
    audio: { sizeBytes, durationMs, interruptedAt: null },
    conversation: { sendProgress },
  }
}

test("normalizeLoadedRecordings() queues stop sheets left open and stale recordings", (t) => {
  const { keep, remove, patches } = normalizeLoadedRecordings([
    row("b", "recording", { sizeBytes: 1200, durationMs: 30_000 }),
    row("c", "recording"),
    row("d", "uploaded"),
    row("e", "naming"),
  ])
  t.deepEqual(
    keep.map((r) => [r.id, r.status]),
    [
      ["b", "queued"],
      ["d", "uploaded"],
      ["e", "queued"],
    ],
  )
  t.is(keep[0].audio.interruptedAt, 30_000)
  t.is(keep[0].audio.sizeBytes, 1200)
  t.deepEqual(remove, ["c"])
  t.deepEqual(patches, [
    { id: "b", patch: { status: "queued", audio: { interruptedAt: 30_000 } } },
    { id: "e", patch: { status: "queued" } },
  ])
})

test("normalizeLoadedRecordings() queues interrupted uploads but not the one in progress", (t) => {
  const { keep, patches } = normalizeLoadedRecordings(
    [
      row("a", "uploading", { sendProgress: 40 }),
      row("b", "uploading", { sendProgress: 70 }),
    ],
    "b",
  )
  t.deepEqual(
    keep.map((r) => [r.id, r.status, r.conversation.sendProgress]),
    [
      ["a", "queued", 0],
      ["b", "uploading", 70],
    ],
  )
  t.deepEqual(
    patches.map((item) => item.id),
    ["a"],
  )
})
