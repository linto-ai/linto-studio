import test from "ava"
import { resolveSessionBanner } from "../resolveSessionBanner.js"

test("nothing to display when everything is fine", (t) => {
  t.is(resolveSessionBanner("connected", "idle"), null)
  t.is(resolveSessionBanner("connected", "recording"), null)
  t.is(resolveSessionBanner("idle", "muted"), null)
})

test("websocket reconnecting wins over any microphone status", (t) => {
  t.is(
    resolveSessionBanner("reconnecting", "connection_lost"),
    "websocket_reconnecting",
  )
  t.is(resolveSessionBanner("reconnecting", "idle"), "websocket_reconnecting")
})

test("websocket failure wins over any microphone status", (t) => {
  t.is(resolveSessionBanner("failed", "mic_lost"), "websocket_failed")
  t.is(resolveSessionBanner("failed", "recording"), "websocket_failed")
})

test("microphone banner shows only for its recovery statuses", (t) => {
  t.is(resolveSessionBanner("connected", "connection_lost"), "microphone")
  t.is(resolveSessionBanner("connected", "mic_lost"), "microphone")
  t.is(resolveSessionBanner("connected", "mic_interrupted"), "microphone")
  t.is(resolveSessionBanner("connected", "connecting"), null)
})

test("initial connection is not treated as an outage", (t) => {
  t.is(resolveSessionBanner("connecting", "idle"), null)
})
