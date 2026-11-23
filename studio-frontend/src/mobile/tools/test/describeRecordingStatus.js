import test from "ava"
import { describeRecordingStatus } from "../describeRecordingStatus.js"

// A row with what the status reads: its status, its sending error, the
// duration of its audio.
function row(status, sendError = null, durationMs = 0) {
  return { status, conversation: { sendError }, audio: { durationMs } }
}

test("describeRecordingStatus() distinguishes queued online from queued offline", (t) => {
  t.is(
    describeRecordingStatus(row("queued"), true).label,
    "mobile.queue.status_queued",
  )
  t.is(
    describeRecordingStatus(row("queued"), false).label,
    "mobile.queue.status_offline",
  )
})

test("describeRecordingStatus() maps the other statuses and falls back to error", (t) => {
  t.is(describeRecordingStatus(row("uploading"), true).tone, "info")
  t.is(describeRecordingStatus(row("uploaded"), true).tone, "success")
  t.is(describeRecordingStatus(row("weird"), true).tone, "danger")
})

test("describeRecordingStatus() shows a spent quota as a wait", (t) => {
  const view = describeRecordingStatus(row("error", { code: "quota" }), true)
  t.is(view.tone, "warning")
  t.is(view.label, "mobile.queue.status_waiting_credit")
  t.is(
    describeRecordingStatus(row("error", { code: "rejected" }), true).tone,
    "danger",
  )
})

test("describeRecordingStatus() asks to transcribe once the minutes cover it", (t) => {
  const recording = row("error", { code: "quota" }, 180_000)
  t.is(describeRecordingStatus(recording, true, 2).key, "waiting_credit")
  const ready = describeRecordingStatus(recording, true, 3)
  t.is(ready.key, "ready_to_transcribe")
  t.is(ready.tone, "info")
  t.is(ready.label, "mobile.queue.status_ready_to_transcribe")
})
