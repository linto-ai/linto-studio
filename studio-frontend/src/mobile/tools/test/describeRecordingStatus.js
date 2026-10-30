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

test("describeRecordingStatus() shows a spent quota as a wait", (t) => {
  const view = describeRecordingStatus(
    { status: "error", error: { code: "quota" } },
    true,
  )
  t.is(view.tone, "warning")
  t.is(view.label, "mobile.queue.status_waiting_credit")
  t.is(
    describeRecordingStatus(
      { status: "error", error: { code: "rejected" } },
      true,
    ).tone,
    "danger",
  )
})

test("describeRecordingStatus() asks to transcribe once the minutes cover it", (t) => {
  const recording = {
    status: "error",
    error: { code: "quota" },
    durationMs: 180_000,
  }
  t.is(describeRecordingStatus(recording, true, 2).key, "waiting_credit")
  const ready = describeRecordingStatus(recording, true, 3)
  t.is(ready.key, "ready_to_transcribe")
  t.is(ready.tone, "info")
  t.is(ready.label, "mobile.queue.status_ready_to_transcribe")
})
