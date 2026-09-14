import test from "ava"
import { describeRecordingStatus } from "../describeRecordingStatus.js"

test("describeRecordingStatus() distinguishes ready online from ready offline", (t) => {
  t.is(
    describeRecordingStatus({ status: "ready" }, true).label,
    "mobile.queue.status_ready",
  )
  t.is(
    describeRecordingStatus({ status: "ready" }, false).label,
    "mobile.queue.status_offline",
  )
})

test("describeRecordingStatus() maps the other statuses and falls back to error", (t) => {
  t.is(describeRecordingStatus({ status: "uploading" }, true).tone, "info")
  t.is(describeRecordingStatus({ status: "uploaded" }, true).icon, "check")
  t.is(describeRecordingStatus({ status: "weird" }, true).tone, "danger")
})
