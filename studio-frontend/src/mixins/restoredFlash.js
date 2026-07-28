// Shared "connection restored" flash: exposes `showRestored`, true for
// `duration` ms after the watched websocket status recovers from an outage
// (reconnecting/failed → connected). Used by WebsocketStatusDot and
// SessionStatusBanner, each with its own status prop name and duration.
export function createRestoredFlashMixin(statusKey, duration) {
  return {
    data() {
      return { showRestored: false }
    },
    created() {
      // Plain instance field: a timer handle has no business being reactive.
      this.restoredFlashTimer = null
    },
    watch: {
      [statusKey](newStatus, oldStatus) {
        clearTimeout(this.restoredFlashTimer)
        const wasRecovering =
          oldStatus === "reconnecting" || oldStatus === "failed"
        if (newStatus === "connected" && wasRecovering) {
          this.showRestored = true
          this.restoredFlashTimer = setTimeout(() => {
            this.showRestored = false
          }, duration)
        } else {
          this.showRestored = false
        }
      },
    },
    beforeDestroy() {
      clearTimeout(this.restoredFlashTimer)
    },
  }
}
