import { isCoveredByCredit } from "./isCoveredByCredit.js"

const STATUS_VIEWS = Object.freeze({
  queued_online: {
    tone: "info",
    icon: "clock",
    label: "mobile.queue.status_queued",
  },
  queued_offline: {
    tone: "warning",
    icon: "wifi-slash",
    label: "mobile.queue.status_offline",
  },
  uploading: {
    tone: "info",
    icon: "upload-simple",
    label: "mobile.queue.status_uploading",
  },
  waiting_credit: {
    tone: "warning",
    icon: "hourglass",
    label: "mobile.queue.status_waiting_credit",
  },
  ready_to_transcribe: {
    tone: "info",
    icon: "sparkle",
    label: "mobile.queue.status_ready_to_transcribe",
  },
  error: {
    tone: "danger",
    icon: "warning-circle",
    label: "mobile.queue.status_error",
  },
  uploaded: {
    tone: "success",
    icon: "check",
    label: "mobile.queue.status_uploaded",
  },
  recording: {
    tone: "danger",
    icon: "record",
    label: "mobile.queue.status_recording",
  },
})

/**
 * Icon, tone and label key for a queue item, given the network state and
 * the transcription minutes available. A refusal for a spent quota waits
 * for minutes; once they cover the recording, it is the user's to send
 * (it consumes the organization's minutes), not an error.
 * @param {{ status: string, error?: { code: string }, durationMs?: number }} recording
 * @param {boolean} online
 * @param {number|null} [availableMinutes] - null when not counted or unknown
 * @returns {{ key: string, tone: string, icon: string, label: string }}
 */
export function describeRecordingStatus(
  recording,
  online,
  availableMinutes = null,
) {
  const key = computeStatusKey(recording, online, availableMinutes)
  return { key, ...STATUS_VIEWS[key] }
}

function computeStatusKey(recording, online, availableMinutes) {
  const { status, error } = recording
  if (status === "queued") return online ? "queued_online" : "queued_offline"
  if (status === "error" && error?.code === "quota") {
    return isCoveredByCredit(recording, availableMinutes)
      ? "ready_to_transcribe"
      : "waiting_credit"
  }
  return status in STATUS_VIEWS ? status : "error"
}
