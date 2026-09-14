import test from "ava"
import { describeRecordingStatus } from "../describeRecordingStatus.js"

test("describeRecordingStatus() keeps a kept recording manual whatever the network", (t) => {
  t.is(
    describeRecordingStatus({ status: "ready" }, true).label,
    "mobile.queue.status_ready",
  )
  t.is(
    describeRecordingStatus({ status: "ready" }, false).label,
    "mobile.queue.status_ready",
  )
})

test("describeRecordingStatus() distinguishes queued online from queued offline", (t) => {
  t.is(
    describeRecordingStatus({ status: "queued" }, true).label,
    "mobile.queue.status_queued",
  )
  t.is(
    describeRecordingStatus({ status: "queued" }, false).label,
    "mobile.queue.status_offline",
  )
})

test("describeRecordingStatus() maps the other statuses and falls back to error", (t) => {
  t.is(describeRecordingStatus({ status: "uploading" }, true).tone, "info")
  t.is(describeRecordingStatus({ status: "uploaded" }, true).icon, "check")
  t.is(describeRecordingStatus({ status: "weird" }, true).tone, "danger")
})
