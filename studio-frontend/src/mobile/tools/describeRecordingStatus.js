const STATUS_VIEWS = Object.freeze({
  ready_online: {
    tone: "warning",
    icon: "clock",
    label: "mobile.queue.status_ready",
  },
  ready_offline: {
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
    tone: "info",
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
  if (status === "ready") {
    return online ? STATUS_VIEWS.ready_online : STATUS_VIEWS.ready_offline
  }
  return STATUS_VIEWS[status] ?? STATUS_VIEWS.error
}
