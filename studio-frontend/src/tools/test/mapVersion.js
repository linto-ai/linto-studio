import test from "ava"
import { mapVersion, mapVersions } from "../llm/mapVersion.js"

test("mapVersion converts snake_case payload to camelCase shape", (t) => {
  const result = mapVersion({
    version_number: 3,
    created_at: "2026-05-22T10:30:00.000Z",
  })
  t.deepEqual(result, {
    versionNumber: 3,
    createdAt: new Date("2026-05-22T10:30:00.000Z").getTime(),
  })
})

test("mapVersion coerces stringified version_number", (t) => {
  const result = mapVersion({
    version_number: "7",
    created_at: "2026-05-22T10:30:00.000Z",
  })
  t.is(result.versionNumber, 7)
})

test("mapVersion returns null on missing version_number", (t) => {
  t.is(mapVersion({ created_at: "2026-05-22T10:30:00.000Z" }), null)
  t.is(mapVersion({ version_number: "not-a-number" }), null)
})

test("mapVersion returns null on null/undefined input", (t) => {
  t.is(mapVersion(null), null)
  t.is(mapVersion(undefined), null)
})

test("mapVersion falls back to current time on invalid created_at", (t) => {
  const before = Date.now()
  const result = mapVersion({ version_number: 1, created_at: "not-a-date" })
  const after = Date.now()
  t.is(result.versionNumber, 1)
  t.true(result.createdAt >= before && result.createdAt <= after)
})

test("mapVersions maps an array and skips invalid entries", (t) => {
  const result = mapVersions([
    { version_number: 1, created_at: "2026-05-22T10:00:00.000Z" },
    { version_number: "bad" },
    null,
    { version_number: 2, created_at: "2026-05-22T11:00:00.000Z" },
  ])
  t.is(result.length, 2)
  t.is(result[0].versionNumber, 1)
  t.is(result[1].versionNumber, 2)
})

test("mapVersions returns [] on non-array input", (t) => {
  t.deepEqual(mapVersions(null), [])
  t.deepEqual(mapVersions(undefined), [])
  t.deepEqual(mapVersions({}), [])
})
