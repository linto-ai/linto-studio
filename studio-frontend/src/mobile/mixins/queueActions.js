import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatFileSize } from "@/mobile/tools/formatFileSize.js"

// What the Record page does with queue items: the stop sheet after a
// recording, and the per-item actions sheet (send, rename, delete).
export const queueActionsMixin = {
  data() {
    return {
      stopSheetOpen: false,
      stoppedRecording: null,
      actionsOpen: false,
      selected: null,
    }
  },
  computed: {
    stoppedSummary() {
      if (!this.stoppedRecording) return ""
      const duration = formatDurationShort(
        this.stoppedRecording.durationMs || 0,
      )
      const size = formatFileSize(this.stoppedRecording.sizeBytes || 0)
      return this.$t("mobile.record.stopped_summary", { duration, size })
    },
  },
  methods: {
    onRecordingStopped(id) {
      this.stoppedRecording = this.$store.getters["mobileRecordings/byId"](id)
      this.stopSheetOpen = true
      if (this.stoppedRecording?.interruptedAt != null) {
        this.$store.dispatch(
          "system/showWarning",
          this.$t("mobile.record.interrupted"),
        )
      }
    },
    async sendStopped(name) {
      this.stopSheetOpen = false
      await this.$store.dispatch("mobileRecordings/patch", {
        id: this.stoppedRecording.id,
        name,
      })
      this.$store.dispatch("mobileRecordings/upload", this.stoppedRecording.id)
    },
    async keepStopped(name) {
      this.stopSheetOpen = false
      await this.$store.dispatch("mobileRecordings/patch", {
        id: this.stoppedRecording.id,
        name,
      })
    },
    openActions(recording) {
      this.selected = recording
      this.actionsOpen = true
    },
    sendRecording(recording) {
      this.actionsOpen = false
      this.$store.dispatch("mobileRecordings/upload", recording.id)
    },
    async renameRecording({ recording, name }) {
      this.actionsOpen = false
      await this.$store.dispatch("mobileRecordings/patch", {
        id: recording.id,
        name,
      })
    },
    async removeRecording(recording) {
      this.actionsOpen = false
      await this.$store.dispatch("mobileRecordings/remove", recording.id)
    },
  },
}
