<template>
  <div>
    <ReportTemplatesSheet
      v-model="sheetOpen"
      :templates="templates"
      :loading="loading"
      :busy-template-id="busyTemplateId"
      @select="exportWith" />
    <PdfReader
      v-model="readerOpen"
      :file="file"
      :title="readerTitle"
      @input="onReaderToggle"
      @share="share" />
  </div>
</template>

<script>
import { apiGetPublicationTemplates } from "@/api/publication.js"
import ReportTemplatesSheet from "@/mobile/components/publication/ReportTemplatesSheet.vue"
import PdfReader from "@/mobile/components/publication/PdfReader.vue"
import { exportReportPdf } from "@/mobile/services/publication/exportReportPdf.js"
import { shareFile } from "@/mobile/services/export/shareFile.js"
import { getTemplateDisplayName } from "@/tools/getTemplateDisplayName.js"

// "Download" on an AI report of the editor: pick a publication template of
// the service, read the PDF in the app, then share or save it. start() is
// called by the page when the editor asks for a publication.
export default {
  name: "ReportPdfFlow",
  components: { ReportTemplatesSheet, PdfReader },
  props: {
    conversationId: { type: String, required: true },
    conversationName: { type: String, default: "" },
    organizationId: { type: String, default: null },
  },
  data() {
    return {
      jobId: null,
      sheetOpen: false,
      loading: false,
      templates: [],
      busyTemplateId: null,
      readerOpen: false,
      file: null,
      readerTitle: "",
    }
  },
  methods: {
    async start({ serviceId, jobId }) {
      this.jobId = jobId
      this.templates = []
      this.loading = true
      this.sheetOpen = true
      this.templates = await apiGetPublicationTemplates({
        organizationId: this.organizationId,
        serviceId,
      })
      this.loading = false
      // A single template leaves nothing to choose
      if (this.templates.length === 1) this.exportWith(this.templates[0])
    },
    async exportWith(template) {
      if (this.busyTemplateId) return
      this.busyTemplateId = template.id
      const file = await exportReportPdf({
        conversationId: this.conversationId,
        conversationName: this.conversationName,
        jobId: this.jobId,
        template,
        locale: this.$i18n.locale,
      })
      this.busyTemplateId = null
      if (!file) {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.publication.export_failed"),
        )
        return
      }
      this.file = file
      this.readerTitle = getTemplateDisplayName(template, this.$i18n.locale)
      this.sheetOpen = false
      this.readerOpen = true
    },
    // Closing the reader goes back to the templates when there was a choice
    onReaderToggle(open) {
      if (!open && this.templates.length > 1) this.sheetOpen = true
    },
    async share() {
      const outcome = await shareFile(this.file, this.file.name)
      if (outcome === "failed") {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.publication.share_failed"),
        )
      } else if (outcome === "downloaded") {
        this.$store.dispatch(
          "system/showInfo",
          this.$t("mobile.publication.downloaded"),
        )
      }
    },
  },
}
</script>
