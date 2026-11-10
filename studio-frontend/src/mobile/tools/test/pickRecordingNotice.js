import test from "ava"
import { pickRecordingNotice } from "../pickRecordingNotice.js"

const RECORDING = {
  state: "recording",
  pauseReason: null,
  lastGap: null,
  wakeLockOk: true,
}

test("pickRecordingNotice() shows nothing when not recording", (t) => {
  t.is(pickRecordingNotice({ ...RECORDING, state: "idle" }), null)
  t.is(pickRecordingNotice({ ...RECORDING, state: "starting" }), null)
})

test("pickRecordingNotice() advises to stay in the app by default", (t) => {
  t.is(
    pickRecordingNotice(RECORDING).message,
    "mobile.record.notice.stay_in_app",
  )
  t.is(
    pickRecordingNotice({ ...RECORDING, wakeLockOk: false }).message,
    "mobile.record.notice.stay_in_app_screen_on",
  )
})

test("pickRecordingNotice() keeps the advice during a user pause", (t) => {
  const notice = pickRecordingNotice({
    ...RECORDING,
    state: "paused",
    pauseReason: "user",
  })
  t.is(notice.message, "mobile.record.notice.stay_in_app")
})

test("pickRecordingNotice() hides the last gap during a user pause", (t) => {
  const notice = pickRecordingNotice({
    ...RECORDING,
    state: "paused",
    pauseReason: "user",
    lastGap: { durationMs: 1000, reason: "background" },
  })
  t.is(notice.message, "mobile.record.notice.stay_in_app")
})

test("pickRecordingNotice() puts an automatic pause first", (t) => {
  const notice = pickRecordingNotice({
    ...RECORDING,
    state: "paused",
    pauseReason: "microphone",
    lastGap: { durationMs: 1000, reason: "background" },
  })
  t.is(notice.message, "mobile.record.notice.paused_automatically")
  t.is(notice.variant, "warning")
})

test("pickRecordingNotice() reports the last gap until dismissed", (t) => {
  const notice = pickRecordingNotice({
    ...RECORDING,
    lastGap: { durationMs: 240_000, reason: "background" },
  })
  t.is(notice.message, "mobile.record.notice.resumed")
  t.is(notice.durationMs, 240_000)
  t.true(notice.dismissible)
})
