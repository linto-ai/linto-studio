import test from "ava"
import { describeRecordingStatus } from "../describeRecordingStatus.js"

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
  t.is(describeRecordingStatus({ status: "uploaded" }, true).tone, "success")
  t.is(describeRecordingStatus({ status: "weird" }, true).tone, "danger")
})
