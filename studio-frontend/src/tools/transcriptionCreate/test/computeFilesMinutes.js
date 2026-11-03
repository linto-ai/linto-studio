import test from "ava"
import { computeFilesMinutes } from "../computeFilesMinutes.js"

test("a started minute counts, file by file", (t) => {
  t.deepEqual(computeFilesMinutes([61, 61]), { minutes: 4, isPartial: false })
  t.deepEqual(computeFilesMinutes([60]), { minutes: 1, isPartial: false })
})

test("unknown durations make it a minimum", (t) => {
  t.deepEqual(computeFilesMinutes([120, null]), { minutes: 2, isPartial: true })
  t.deepEqual(computeFilesMinutes([null]), { minutes: 0, isPartial: true })
})

test("no file needs nothing", (t) => {
  t.deepEqual(computeFilesMinutes([]), { minutes: 0, isPartial: false })
})
