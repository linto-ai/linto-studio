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
 * Icon, tone and label key for a queue item, given the network state.
 * @param {{ status: string }} recording
 * @param {boolean} online
 * @returns {{ tone: string, icon: string, label: string }}
 */
export function describeRecordingStatus({ status }, online) {
  if (status === "queued") {
    return online ? STATUS_VIEWS.queued_online : STATUS_VIEWS.queued_offline
  }
  return STATUS_VIEWS[status] ?? STATUS_VIEWS.error
}
