import test from "ava"
import { mapGeneration, mapGenerations } from "../llm/mapGeneration.js"

test("mapGeneration maps a completed generation", (t) => {
  const result = mapGeneration({
    generationId: "abc",
    jobId: "job-1",
    createdAt: "2026-05-22T07:18:14+00:00",
    status: "completed",
  })
  t.deepEqual(result, {
    generationId: "abc",
    createdAt: new Date("2026-05-22T07:18:14+00:00").getTime(),
    status: "completed",
  })
})

test("mapGeneration translates 'started' status to 'processing'", (t) => {
  const result = mapGeneration({
    generationId: "abc",
    createdAt: "2026-05-22T07:18:14+00:00",
    status: "started",
  })
  t.is(result.status, "processing")
})

test("mapGeneration normalizes unknown status to 'completed'", (t) => {
  const result = mapGeneration({
    generationId: "abc",
    createdAt: "2026-05-22T07:18:14+00:00",
    status: "wat",
  })
  t.is(result.status, "completed")
})

test("mapGeneration returns null on missing generationId", (t) => {
  t.is(mapGeneration({ createdAt: "2026-05-22T07:18:14+00:00" }), null)
  t.is(mapGeneration(null), null)
  t.is(mapGeneration(undefined), null)
})

test("mapGenerations maps an array and skips invalid entries", (t) => {
  const result = mapGenerations([
    { generationId: "a", createdAt: "2026-05-22T07:18:14+00:00", status: "completed" },
    null,
    { createdAt: "2026-05-22T07:18:14+00:00" }, // missing id
    { generationId: "b", createdAt: "2026-05-22T07:19:14+00:00", status: "error" },
  ])
  t.is(result.length, 2)
  t.is(result[0].generationId, "a")
  t.is(result[1].generationId, "b")
})

test("mapGenerations returns [] on non-array input", (t) => {
  t.deepEqual(mapGenerations(null), [])
  t.deepEqual(mapGenerations(undefined), [])
  t.deepEqual(mapGenerations({}), [])
})
