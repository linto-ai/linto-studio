import { PAUSE_REASON } from "../const/pauseReason.js"

/**
 * The one notice shown above the recorder, most urgent first: an automatic
 * pause still running, then the gap of the last automatic pause (while
 * recording: a user pause after it would contradict it), then the
 * standing advice: the native app keeps recording in the background, the
 * web page has to stay shown (stronger when the screen cannot be kept on).
 * null when nothing is being recorded.
 * @param {{ state: string, pauseReason: string|null,
 *   lastGap: { durationMs: number, reason: string }|null,
 *   wakeLockOk: boolean, capturesInBackground: boolean }} recorder
 * @returns {{ message: string, variant: string, icon: string,
 *   durationMs?: number, dismissible: boolean } | null}
 */
export function pickRecordingNotice(recorder) {
  const { state, pauseReason, lastGap, wakeLockOk, capturesInBackground } =
    recorder
  switch (true) {
    case state !== "recording" && state !== "paused":
      return null
    case state === "paused" && pauseReason !== PAUSE_REASON.USER:
      return {
        message: "mobile.record.notice.paused_automatically",
        variant: "warning",
        icon: "microphone-slash",
        dismissible: false,
      }
    case state === "recording" && lastGap !== null:
      return {
        message: "mobile.record.notice.resumed",
        variant: "info",
        icon: "info",
        durationMs: lastGap.durationMs,
        dismissible: true,
      }
    case capturesInBackground:
      return {
        message: "mobile.record.notice.keeps_recording",
        variant: "info",
        icon: "info",
        dismissible: false,
      }
    case !wakeLockOk:
      return {
        message: "mobile.record.notice.stay_in_app_screen_on",
        variant: "warning",
        icon: "warning",
        dismissible: false,
      }
    default:
      return {
        message: "mobile.record.notice.stay_in_app",
        variant: "info",
        icon: "info",
        dismissible: false,
      }
  }
}
