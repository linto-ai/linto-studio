import test from "ava"
import { mapStatus } from "../llm/mapStatus.js"

test("mapStatus translates 'started' to 'processing'", (t) => {
  t.is(mapStatus("started"), "processing")
})

test("mapStatus passes through other known statuses", (t) => {
  t.is(mapStatus("idle"), "idle")
  t.is(mapStatus("queued"), "queued")
  t.is(mapStatus("processing"), "processing")
  t.is(mapStatus("complete"), "complete")
  t.is(mapStatus("error"), "error")
})

test("mapStatus passes through unknown values without throwing", (t) => {
  t.is(mapStatus(""), "")
  t.is(mapStatus(null), null)
  t.is(mapStatus(undefined), undefined)
  t.is(mapStatus("anything-else"), "anything-else")
})
