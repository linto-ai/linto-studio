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

test("live credit banner shows its level when nothing else is wrong", (t) => {
  t.is(resolveSessionBanner("connected", "idle", "low"), "live_credit_low")
  t.is(
    resolveSessionBanner("connected", "recording", "exhausted"),
    "live_credit_exhausted",
  )
  t.is(resolveSessionBanner("connected", "idle", null), null)
})

test("websocket and microphone trouble win over live credit", (t) => {
  t.is(resolveSessionBanner("failed", "idle", "exhausted"), "websocket_failed")
  t.is(resolveSessionBanner("connected", "mic_lost", "low"), "microphone")
})
