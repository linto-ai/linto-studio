import test from "ava"
import { computeGenerationsIndex } from "../computeGenerationsIndex.js"

const older = {
  generationId: "g1",
  jobId: "j1",
  createdAt: "2026-10-01T10:00:00Z",
}
const newer = {
  generationId: "g2",
  jobId: "j2",
  createdAt: "2026-10-02T10:00:00Z",
}

test("computeGenerationsIndex() maps each generation to its job", (t) => {
  t.deepEqual(computeGenerationsIndex([older, newer]).jobIds, {
    g1: "j1",
    g2: "j2",
  })
})

test("computeGenerationsIndex() prefers the generation flagged current", (t) => {
  const { current } = computeGenerationsIndex([
    { ...older, isCurrent: true },
    newer,
  ])
  t.deepEqual(current, { generationId: "g1", jobId: "j1" })
})

test("computeGenerationsIndex() falls back on the most recent", (t) => {
  const { current } = computeGenerationsIndex([older, newer])
  t.deepEqual(current, { generationId: "g2", jobId: "j2" })
})

test("computeGenerationsIndex() has no current generation without any", (t) => {
  t.deepEqual(computeGenerationsIndex([]), { jobIds: {}, current: null })
})

test("computeGenerationsIndex() skips generations without job", (t) => {
  const { jobIds } = computeGenerationsIndex([{ generationId: "g3" }])
  t.deepEqual(jobIds, {})
})
