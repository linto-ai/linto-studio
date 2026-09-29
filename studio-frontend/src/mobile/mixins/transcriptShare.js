import { fetchTranscriptFile } from "@/mobile/services/export/fetchTranscriptFile.js"
import { shareFile } from "@/mobile/services/export/shareFile.js"

// "Share the verbatim" actions of the media list: fetch the export, then the
// phone's share sheet (or a download). One export at a time.
export const transcriptShareMixin = {
  data() {
    return { exporting: false }
  },
  methods: {
    async shareTranscript({ media, format }) {
      if (this.exporting) return
      this.exporting = true
      this.notify("showInfo", "mobile.media.export_preparing")
      const file = await fetchTranscriptFile(media, format)
      const outcome = file ? await shareFile(file, media.name) : "failed"
      this.exporting = false
      if (outcome === "failed")
        this.notify("showError", "mobile.media.export_failed")
      if (outcome === "downloaded") {
        this.notify("showSuccess", "mobile.media.export_downloaded")
      }
    },
    notify(action, key) {
      this.$store.dispatch(`system/${action}`, this.$t(key))
    },
  },
}
