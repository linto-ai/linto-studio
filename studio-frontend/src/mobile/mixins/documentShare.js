import { fetchDocumentFile } from "@/mobile/services/library/fetchDocumentFile.js"
import { shareFile } from "@/mobile/services/export/shareFile.js"

// "Share this document" from a library entry: the generated document as a
// PDF through the phone's share sheet (or a download). One at a time.
export const documentShareMixin = {
  data() {
    return { sharingDocument: false }
  },
  methods: {
    async shareDocument({ conversation, document }) {
      if (this.sharingDocument) return
      this.sharingDocument = true
      this.$store.dispatch(
        "system/showInfo",
        this.$t("mobile.media.export_preparing"),
      )
      const file = await fetchDocumentFile(conversation, document)
      const outcome = file ? await shareFile(file, file.name) : "failed"
      this.sharingDocument = false
      if (outcome === "failed") {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.media.export_failed"),
        )
      }
    },
  },
}
