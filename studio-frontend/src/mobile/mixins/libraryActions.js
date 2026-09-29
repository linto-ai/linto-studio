import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatFileSize } from "@/mobile/tools/formatFileSize.js"
import { isRecordingQuiet } from "@/mobile/tools/isRecordingQuiet.js"
import { saveKeepAudioPreference } from "@/mobile/services/preferences/keepAudioPreference.js"
import { buildRecordingFile } from "@/mobile/services/recording/buildRecordingFile.js"
import { shareFile } from "@/mobile/services/export/shareFile.js"

// What the Record page does with its recordings: the stop sheet after a
// recording (name, keep the audio, then it is sent by itself) and the
// detail sheet of a library entry.
export const libraryActionsMixin = {
  data() {
    return {
      stopSheetOpen: false,
      stoppedRecording: null,
      recordingSheetOpen: false,
      selected: null,
    }
  },
  computed: {
    stoppedQuiet() {
      return isRecordingQuiet(this.stoppedRecording)
    },
    stoppedSummary() {
      if (!this.stoppedRecording) return ""
      const duration = formatDurationShort(
        this.stoppedRecording.durationMs || 0,
      )
      const size = formatFileSize(this.stoppedRecording.sizeBytes || 0)
      return this.$t("mobile.record.stopped_summary", { duration, size })
    },
  },
  watch: {
    stopSheetOpen(open) {
      if (!open) this.onStopSheetClosed()
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
    async finishStopped({ name, keepAudio }) {
      const id = this.stoppedRecording.id
      saveKeepAudioPreference(keepAudio)
      await this.$store.dispatch("mobileRecordings/patch", {
        id,
        name,
        keepAudio,
        status: "queued",
      })
      this.stopSheetOpen = false
      this.$store.dispatch("mobileRecordings/upload", id)
    },
    // The sheet dismissed without "Done": sent all the same, as it stands.
    onStopSheetClosed() {
      const current = this.$store.getters["mobileRecordings/byId"](
        this.stoppedRecording?.id,
      )
      if (current?.status !== "naming") return
      this.finishStopped({ name: current.name, keepAudio: current.keepAudio })
    },
    openRecording(recording) {
      this.selected = recording
      this.recordingSheetOpen = true
    },
    retryUpload(recording) {
      this.$store.dispatch("mobileRecordings/patch", {
        id: recording.id,
        status: "queued",
        error: null,
      })
      this.$store.dispatch("mobileRecordings/upload", recording.id)
    },
    async renameRecording({ recording, name }) {
      await this.$store.dispatch("mobileRecordings/patch", {
        id: recording.id,
        name,
      })
    },
    async shareAudio(recording) {
      const file = await buildRecordingFile(recording)
      const outcome = file ? await shareFile(file, recording.name) : "failed"
      if (outcome === "failed") {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.library.share_audio_failed"),
        )
      }
    },
    async removeRecording(recording) {
      this.recordingSheetOpen = false
      await this.$store.dispatch("mobileRecordings/remove", recording.id)
    },
  },
}
