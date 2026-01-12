<template>
  <MainContentConversation
    :conversation="conversation"
    :breadcrumbItems="breadcrumbItems"
    :status="status"
    :dataLoaded="dataLoaded"
    :dataLoadedStatus="dataLoadedStatus"
    :error="error"
    :sidebar="true">
    <template v-slot:sidebar>
      <div class="form-field flex col medium-margin gap-medium">
        <AppEditorChannelsSelector
          v-if="channels && channels.length > 0"
          :channels="channels"
          v-model="selectedChannel" />
        <AppEditorTranslationSelector
          v-if="translations && translations.length > 0"
          :translations="translations"
          v-model="selectedTranslation" />
      </div>
      <div class="flex col gap-medium publish-content-wrapper flex1">
        <!-- Status Section -->
        <section class="flex col gap-medium">
          <div v-if="isUpdated" class="flex align-center gap-small">
            <span class="icon done"></span>
            <span>
              {{ $t("publish.is_updated") }}
            </span>
          </div>
          <div v-else class="flex align-center gap-small">
            <span class="icon warning"></span>
            <span>
              {{ $t("publish.is_not_updated") }}
            </span>
          </div>
          <!-- Show regenerate button only when document is outdated OR user is admin -->
          <Button
            v-if="!isUpdated || isAdmin"
            variant="secondary"
            icon="arrow-clockwise"
            block
            :label="$t('publish.reload_document')"
            @click="confirmRegenerate" />
        </section>

        <!-- Generation Timeline (replaces simple version list) -->
        <section
          v-if="isEditableOutput"
          class="generations-section flex1 flex col">
          <GenerationTimeline
            :generations="generations"
            :currentGenerationId="currentGenerationId"
            :versions="savedVersions"
            :currentVersionNumber="currentVersionNumber"
            :loading="
              currentStatus === 'processing' || currentStatus === 'queued'
            "
            @select-generation="selectGeneration"
            @select-version="handleSelectVersion" />
        </section>
      </div>
    </template>

    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small reset-overflows align-center">
        <PopoverList
          :items="optionsExport"
          class="publish-export-popover"
          closeOnItemClick
          @click="exportConv">
          <template #trigger="{ open }">
            <Button
              icon="download"
              variant="primary"
              size="sm"
              :label="$t('conversation.export.title')">
            </Button>
          </template>
        </PopoverList>
      </div>
    </template>

    <div class="publish-main-container flex col" v-if="dataLoaded">
      <!-- AI Service Menu -->
      <div class="publish-service-menu-wrapper">
        <AIServiceMenu
          v-model="activeTab"
          :services="indexedFormat"
          :tabs="tabs"
          v-if="tabs && tabs.length > 0" />
      </div>

      <!-- Publication Tab Content - Shows only templates grid -->
      <!-- <PublicationSection
        v-if="activeTab === 'publication'"
        :jobId="currentJobId"
        :organizationId="publicationOrganizationId"
        :conversationName="conversation?.name || 'export'"
        :versionNumber="currentVersionNumber"
        class="publication-section-wrapper" /> -->

      <!-- Regular content for other tabs (verbatim, AI services) -->
      <ConversationPublishContent
        ref="publishContent"
        :markdownContent="markdownContent"
        :status="currentStatus"
        :blobUrl="blobUrl"
        :pdfPercentage="generationPercentage"
        :phase="generationPhase"
        :editable="isEditableOutput"
        :errorMessage="currentJobError"
        :jobId="currentJobId"
        :organizationId="publicationOrganizationId"
        :conversationName="conversation?.name || 'export'"
        :versionNumber="currentVersionNumber"
        @content-change="onContentChange"
        @retry="reloadGeneration"
        @save-version="saveVersion" />
    </div>

    <!-- Regenerate Confirmation Modal -->
    <Modal
      v-model="showRegenerateConfirm"
      :title="$t('publish.regenerate.confirm_title')"
      :textActionApply="$t('publish.regenerate.confirm_button')"
      @confirm="executeRegenerate"
      @cancel="showRegenerateConfirm = false">
      <template #content>
        <p>{{ $t("publish.regenerate.confirm_message") }}</p>
      </template>
    </Modal>
  </MainContentConversation>
</template>
<script>
import moment from "moment"
import { jsPDF } from "jspdf"

import { conversationMixin } from "../mixins/conversation.js"
import { orgaRoleMixin } from "../mixins/orgaRole.js"
import {
  apiGetJsonFileFromConversation,
  apiGetTextFileFromConversation,
  apiGetDocxFileFromConversation,
  apiGetGenericFileFromConversation,
  apiGetConversationLastUpdate,
} from "../api/conversation.js"
import {
  getLLMService,
  apiGetMetadataLLMService,
  apiUpdateExportResult,
  apiListExportVersions,
  apiGetExportVersion,
  apiRestoreExportVersion,
  apiExportDocument,
  apiListGenerations,
  apiGetExportContent,
} from "@/api/service.js"

import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"

import Loading from "@/components/atoms/Loading.vue"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import AppEditor from "@/components/AppEditor.vue"
import MainContentConversation from "@/components/MainContentConversation.vue"
import MenuToolbox from "@/components/MenuToolbox.vue"
import CustomSelect from "@/components/molecules/CustomSelect.vue"
import SwitchInput from "@/components/atoms/SwitchInput.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import TranscriptionHelper from "@/components/TranscriptionHelper.vue"
import ConversationPublishContent from "@/components/ConversationPublishContent.vue"
import AppEditorChannelsSelector from "@/components/AppEditorChannelsSelector.vue"
import AppEditorTranslationSelector from "@/components/AppEditorTranslationSelector.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import GenerationTimeline from "@/components/GenerationTimeline.vue"
import AIServiceMenu from "@/components/AIServiceMenu.vue"
import PublicationSection from "@/components/PublicationSection.vue"
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"
export default {
  mixins: [conversationMixin, orgaRoleMixin],
  data() {
    return {
      selfUrl: (convId) => `/interface/conversations/${convId}/publish`,
      conversationId: "",
      filterSpeakers: [],
      helperVisible: false,
      pdfStatus: null,
      status: null,
      filterTags: [],
      activeTab: "",
      loading: false,
      blobUrl: null,
      indexedFormat: {},
      loadingServices: true,
      jobsList: [],
      conv_last_update: null,
      currentTabId: null,
      loadingDownload: false,
      pollingJob: null,
      markdownContent: null,
      // Versioning
      savedVersions: [],
      editedContent: null,
      // Socket.io
      socket: null,
      socketConnected: false,
      // Generations
      generations: [],
      currentGenerationId: null,
      showRegenerateConfirm: false,
      currentVersionNumber: null,
    }
  },
  mounted() {
    this.getLastUpdate()
    this.getServices()
    this.initSocket()
  },
  beforeDestroy() {
    clearTimeout(this.pollingJob)
    this.activeTab = "destroyed"
    this.cleanupSocket()
  },
  watch: {
    dataLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
        // Join LLM socket room now that conversation is loaded
        this.joinLlmRoom()
      }
    },
    async activeTab(newVal, oldVal) {
      await this.initGeneration()
      // Load generations after job list is populated
      await this.loadGenerations()
      await this.loadVersions()
      // Automatically select and load the latest version
      await this.selectLatestVersion()
      // Switch to preview mode for AI services (not verbatim or publication)
      if (newVal && newVal !== "verbatim" && newVal !== "publication") {
        this.$nextTick(() => {
          this.$refs.publishContent?.setViewMode("preview")
        })
      }
    },
    async selectedTranslation(newVal, oldVal) {
      // Auto-load document when translation language changes
      if (newVal !== oldVal) {
        await this.initGeneration()
        await this.loadGenerations()
        await this.loadVersions()
        // Automatically select and load the latest version
        await this.selectLatestVersion()
      }
    },
    selectedChannel(newVal, oldVal) {
      // Auto-load document when channel changes
      if (newVal !== oldVal) {
        this.initGeneration()
      }
    },
    markdownContent(newVal) {
      // Reset editedContent when new content is loaded
      // This ensures hasContentChanges computed property works correctly
      this.editedContent = null
    },
  },
  computed: {
    hasContentChanges() {
      // Use the data property that's updated by onContentChange event
      // This is reactive, unlike calling $refs method
      if (this.editedContent === null) return false
      return this.editedContent !== this.markdownContent
    },
    optionsExport() {
      // Verbatim export options - always the same regardless of active tab
      // AI service exports (DOCX/PDF from templates) are handled in PublicationSection
      return [
        { value: "docx", text: this.$t("conversation.export.docx") },
        { value: "pdf", text: this.$t("conversation.export.pdf") },
        { value: "txt", text: this.$t("conversation.export.txt") },
        { value: "json", text: this.$t("conversation.export.json") },
        { value: "whisperx", text: this.$t("conversation.export.whisperx") },
      ]
    },
    dataLoaded() {
      return this.conversationLoaded && !this.loadingServices
    },
    dataLoadedStatus() {
      if (!this.conversationLoaded) {
        return this.$t("conversation.loading.conversation_data")
      }
      if (this.loadingServices) {
        return this.$t("conversation.loading.llm_services")
      }
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    exportFileTitle() {
      return `${this.conversation.name.replace(/\s/g, "_")}_${moment().format(
        "YYYYMMDDHHmmss",
      )}`
    },
    tabs() {
      const res = Object.keys(this.indexedFormat).map((format) => {
        const description = getDescriptionByLanguage(
          this.indexedFormat[format].description,
          this.$i18n.locale,
        )
        return {
          name: format,
          label: description,
          icon: "file-text",
        }
      })

      if (res && res.length > 0) {
        const resWithCri = [
          {
            name: "verbatim",
            label: this.$i18n.t(`publish.tabs.verbatim`),
            icon: "file-text",
          },
          ...res,
          // {
          //   name: "publication",
          //   label: this.$i18n.t(`publish.tabs.publication`),
          //   icon: "file-text",
          // },
        ]

        // Default to verbatim when arriving on export view
        this.activeTab = "verbatim"
        return resWithCri
      } else {
        this.activeTab = "verbatim"
      }
      return res
    },
    selectedFlavor() {
      // Verbatim and publication are not LLM services, have no flavor
      if (this.activeTab === "verbatim" || this.activeTab === "publication")
        return null
      // return the default flavor name, or first one as fallback
      const flavors = this.indexedFormat[this.activeTab]?.flavors
      return flavors?.find((f) => f.is_default)?.name || flavors?.[0]?.name
    },
    defaultFlavor() {
      // Helper to get the default flavor object for current tab
      const flavors = this.indexedFormat[this.activeTab]?.flavors
      return flavors?.find((f) => f.is_default) || flavors?.[0]
    },
    outputFormating() {
      // Verbatim produces DOCX/PDF output (not editable markdown)
      // Publication tab doesn't have direct output format
      if (this.activeTab === "verbatim" || this.activeTab === "publication")
        return "abstractive"
      // abstractive / markdown / text
      return this.defaultFlavor?.output_type
    },
    isEditableOutput() {
      // Text and markdown outputs can be edited, PDF/abstractive cannot
      return ["text", "markdown"].includes(this.outputFormating)
    },
    selectedRoute() {
      return this.indexedFormat[this.activeTab]?.route
    },
    currentJob() {
      // V2: Use selectedRoute (service.route) to match job format, fallback to activeTab for legacy
      const format = this.selectedRoute || this.activeTab
      return this.jobsList.find((item) => item.format === format)
    },
    isUpdated() {
      const job = this.currentJob

      if (job) {
        if (job.status === "error" || job.status === "unknown") {
          return false
        }
        const format_last_update = new Date(job.last_update)
        const conversation_last_update = new Date(this.conv_last_update)
        return format_last_update >= conversation_last_update
      }
      return true
    },
    label_format() {
      return this.tabs.find((tab) => tab.name === this.activeTab)?.label
    },
    currentStatus() {
      if (this.blobUrl) {
        return "complete"
      }
      return this?.currentJob?.status || "queued"
    },
    generationPercentage() {
      return Number(this?.currentJob?.processing || 0)
    },
    generationPhase() {
      return this?.currentJob?.phase || null
    },
    currentJobError() {
      const error = this.currentJob?.error
      if (!error) return null

      // Transform technical errors to user-friendly messages
      if (error.includes("status code 500") || error.includes("500")) {
        return this.$t("publish.error_llm_server")
      }
      if (error.includes("status code 502") || error.includes("502")) {
        return this.$t("publish.error_llm_unavailable")
      }
      if (error.includes("status code 503") || error.includes("503")) {
        return this.$t("publish.error_llm_unavailable")
      }
      if (error.includes("status code 404") || error.includes("not found")) {
        return this.$t("publish.error_job_expired")
      }
      if (error.includes("ECONNREFUSED") || error.includes("connect")) {
        return this.$t("publish.error_llm_unavailable")
      }
      if (error.includes("timeout") || error.includes("ETIMEDOUT")) {
        return this.$t("publish.error_timeout")
      }

      return error
    },
    breadcrumbItems() {
      return [
        {
          label: this.rootConversation?.name ?? "",
        },
        {
          label: this.$t("breadcrumb.transcription"),
          to: {
            name: "conversations transcription",
            params: { conversationId: this.conversationId },
          },
        },
        {
          label: this.$t("breadcrumb.publish"),
        },
      ]
    },
    currentJobId() {
      // For publication tab, get the job ID from current generation or job
      // This allows publication templates to use completed jobs
      if (this.activeTab === "publication") {
        // Try to get jobId from current generation first
        const currentGen = this.generations?.find(
          (g) => g.generationId === this.currentGenerationId,
        )
        if (currentGen?.jobId) {
          return currentGen.jobId
        }
      }
      return this.currentJob?.jobId || null
    },
    publicationOrganizationId() {
      return this.conversation?.organization?.organizationId || null
    },
  },
  methods: {
    initConversationHook() {
      // Method intentionally empty - hook for future use
    },
    showHelper() {
      this.helperVisible = true
    },
    closeHelper() {
      this.helperVisible = false
    },
    async initGeneration(regenerate = false) {
      clearTimeout(this.pollingJob)
      this.blobUrl = null
      await this.getPreview(regenerate)
      await this.getJobsList(true)
      await this.pollingGeneration(true, this.activeTab)
    },
    exportConv({ value }) {
      // Verbatim export - always use direct conversation export
      // AI service exports (via LLM Gateway templates) are handled in PublicationSection
      switch (value) {
        case "docx":
          this.exportDocx()
          break
        case "txt":
          this.exportText()
          break
        case "json":
          this.exportJson()
          break
        case "whisperx":
          this.exportWhisperX()
          break
        case "pdf":
          this.exportPdf()
          break
        default:
          break
      }
    },
    async exportMarkdown() {
      this.loadingDownload = true
      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.selectedRoute || this.activeTab,
        this.selectedFlavor,
        {
          preview: false,
          title: this.label_format,
        },
      )

      if (req?.status === "success") {
        this.exportBlobFile(req.data, ".md")
      }
      this.loadingDownload = false
    },
    async exportJson() {
      this.loadingDownload = true
      let req = await apiGetJsonFileFromConversation(
        this.conversationId,
        this.filterSpeakers,
        this.filterTags,
      )
      if (req?.status === "success") {
        this.exportFile(
          JSON.stringify(req?.data, null, 4),
          "application/json",
          ".json",
        )
      }
      this.loadingDownload = false
    },
    async exportWhisperX() {
      this.loadingDownload = true
      let req = await apiGetJsonFileFromConversation(
        this.conversationId,
        this.filterSpeakers,
        this.filterTags,
        "whisperx",
      )
      if (req?.status === "success") {
        this.exportFile(
          JSON.stringify(req?.data, null, 2),
          "application/json",
          "_whisperx.json",
        )
      }
      this.loadingDownload = false
    },
    async exportText() {
      this.loadingDownload = true
      let req = await apiGetTextFileFromConversation(
        this.conversationId,
        this.filterSpeakers,
        this.filterTags,
      )

      if (req?.status === "success") {
        this.exportFile(req.data, "text/plain", ".txt")
      }
      this.loadingDownload = false
    },
    async exportDocx() {
      this.loadingDownload = true
      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.selectedRoute || this.activeTab,
        this.selectedFlavor,
        {
          preview: false,
          title: this.label_format,
        },
      )

      if (req?.status === "success") {
        this.exportBlobFile(req.data, ".docx")
      }
      this.loadingDownload = false
    },
    exportPdfFromEditor(element, title) {
      const doc = new jsPDF("p", "pt", "letter")
      doc.html(element, {
        callback: function (doc) {
          doc.save(title)
        },
        margin: [72, 72, 72, 72],
        autoPaging: "text",
        width: 600,
        windowWidth: 750,
        html2canvas: {
          allowTaint: true,
          dpi: 600,
          letterRendering: true,
          logging: false,
          scale: 0.625,
        },
      })
    },
    async exportPdf() {
      this.loadingDownload = true

      if (document.getElementById("markdown-editor-container")) {
        this.exportPdfFromEditor(
          document.getElementById("markdown-editor-container"),
          this.exportFileTitle,
        )
      } else {
        let req = await apiGetGenericFileFromConversation(
          this.conversationId,
          this.selectedRoute || this.activeTab,
          this.selectedFlavor,
          {
            preview: true,
            title: this.label_format,
          },
        )

        if (req?.status === "success") {
          this.exportBlobFile(req.data, ".pdf")
        }
      }

      this.loadingDownload = false
    },
    exportBlobFile(blob, ext) {
      const file = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = file
      link.download = this.exportFileTitle + ext
      link.click()
      URL.revokeObjectURL(link.href)
    },
    exportFile(content, type, ext) {
      const file = URL.createObjectURL(new Blob([content], { type }))
      const link = document.createElement("a")
      link.href = file
      link.download = this.exportFileTitle + ext
      link.click()
      URL.revokeObjectURL(link.href)
    },
    async exportViaGateway(format) {
      this.loadingDownload = true
      try {
        const jobId = this.currentJob?.jobId
        if (!jobId) {
          // Try to get jobId from current generation if available
          const currentGen = this.generations.find(
            (g) => g.generationId === this.currentGenerationId,
          )
          if (currentGen?.jobId) {
            // Update jobsList and retry
            const serviceId = this.selectedRoute || this.activeTab
            const existingJobIndex = this.jobsList.findIndex(
              (j) => j.format === serviceId,
            )
            if (existingJobIndex !== -1) {
              this.$set(this.jobsList, existingJobIndex, {
                ...this.jobsList[existingJobIndex],
                jobId: currentGen.jobId,
              })
            }
            // Pass version number to export the specific version from database
            const blob = await apiExportDocument(
              this.conversationId,
              currentGen.jobId,
              format,
              this.currentVersionNumber,
            )
            if (blob) {
              this.exportBlobFile(blob, `.${format}`)
            } else {
              throw new Error("Export returned no data")
            }
            return
          }
          console.error(
            "No job ID available for export. currentJob:",
            this.currentJob,
            "currentGenerationId:",
            this.currentGenerationId,
          )
          throw new Error("No job ID available")
        }
        // Pass version number to export the specific version from database
        const blob = await apiExportDocument(
          this.conversationId,
          jobId,
          format,
          this.currentVersionNumber,
        )
        if (blob) {
          this.exportBlobFile(blob, `.${format}`)
        } else {
          throw new Error("Export returned no data")
        }
      } catch (e) {
        console.error("Export failed:", e)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.export_error"),
        })
      } finally {
        this.loadingDownload = false
      }
    },
    async getServices() {
      try {
        let services = await getLLMService()
        let res = {}
        for (const service of services) {
          const format = service.name
          if (res[format] === undefined) {
            res[format] = {}
          }
          res[format]["flavors"] = service.flavors
          res[format]["description"] = service.description
          res[format]["route"] = service.route
          res[format]["format"] = service.format
          res[format]["service_category"] = service.service_category || null
        }
        this.indexedFormat = res
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingServices = false
      }
    },
    async getPreview(regenerate = false) {
      const currentTab = this.activeTab
      // Skip if no format is selected yet (prevents 400 errors on initial load)
      // Also skip for publication tab which shows templates, not a preview
      const format = this.selectedRoute || this.activeTab
      if (!format || this.activeTab === "publication") {
        return
      }
      this.markdownContent = null
      this.blobUrl = null

      // For editable outputs, fetch fresh content from gateway (single source of truth)
      if (this.isEditableOutput && this.currentJob?.jobId && !regenerate) {
        const contentResult = await apiGetExportContent(
          this.conversationId,
          this.currentJob.jobId,
        )

        if (currentTab !== this.activeTab) return

        if (contentResult.status === "success") {
          this.markdownContent = contentResult.content
          return
        }

        if (contentResult.status === "job_not_found") {
          if (contentResult.gatewayAvailable) {
            // Gateway is up but job is gone - refresh generations list
            // Do NOT auto-regenerate - other generations may exist
            this.$store.dispatch("system/addNotification", {
              type: "info",
              message: this.$t("publish.job_removed_refreshing"),
            })
            // Refresh the generations list to show remaining valid generations
            await this.loadGenerations()
            await this.loadVersions()
            // If no generations remain, the UI will show empty state with regenerate button
            return
          } else {
            // Gateway is down - show error
            this.$store.dispatch("system/addNotification", {
              type: "error",
              message: this.$t("publish.llm_gateway_unavailable"),
            })
            return
          }
        }

        if (contentResult.status === "gateway_unavailable") {
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: this.$t("publish.llm_gateway_unavailable"),
          })
          return
        }

        // For other errors, fall through to legacy flow
        if (contentResult.status === "error") {
          // Continue with the original apiGetGenericFileFromConversation
          // This handles cases where the new endpoint isn't available yet
        }
      }

      // For non-editable outputs (PDF, DOCX) or when regenerating, use existing flow
      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.selectedRoute || this.activeTab,
        this.selectedFlavor,
        {
          preview: !this.isEditableOutput,
          title: this.label_format,
          regenerate,
          llmOutputType: this.outputFormating,
        },
      )

      if (currentTab !== this.activeTab) {
        return
      }

      if (req?.status === "success") {
        if (req.data.type === "application/json") {
          // Check if this is an error response from backend
          try {
            const text = await req.data.text()
            const json = JSON.parse(text)

            // Handle LLM Gateway errors
            if (
              json.status === "error" &&
              json.errorType === "llm_gateway_error"
            ) {
              this.$store.dispatch("system/addNotification", {
                type: "error",
                message: this.$t("publish.llm_gateway_error", {
                  error: json.error,
                }),
              })
              return
            }

            // Handle job not found - refresh generations instead of auto-regenerate
            if (json.status === "job_not_found" && json.requiresRegeneration) {
              this.$store.dispatch("system/addNotification", {
                type: "info",
                message: this.$t("publish.job_removed_refreshing"),
              })
              // Refresh generations list instead of auto-regenerating
              await this.loadGenerations()
              await this.loadVersions()
              return
            }
          } catch (e) {
            // Not JSON, just ignore
          }

          this.blobUrl = null
          return
        } else if (req.data.type === "application/pdf") {
          this.blobUrl = URL.createObjectURL(req.data)
        } else if (req.data.type === "text/plain") {
          this.blobUrl = null
          this.markdownContent = await req.data.text()
        } else {
          this.blobUrl = null
        }
      } else if (req?.status === "error") {
        // Handle error responses
        const errorMessage =
          req?.message ||
          req?.error?.response?.data?.error ||
          this.$t("publish.generic_error")
        const statusCode = req?.error?.response?.status

        // Check for job not found (410)
        if (statusCode === 410) {
          this.$store.dispatch("system/addNotification", {
            type: "info",
            message: this.$t("publish.job_removed_refreshing"),
          })
          // Refresh generations list instead of auto-regenerating
          await this.loadGenerations()
          await this.loadVersions()
          return
        }

        // Check for LLM Gateway error (502)
        if (statusCode === 502) {
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: this.$t("publish.llm_gateway_unavailable"),
          })
          return
        }

        // Generic error
        if (regenerate) {
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: errorMessage,
          })
        }
      }
    },
    async pollingGeneration(first = false, currentTab) {
      if (currentTab === "destroyed" || currentTab !== this.activeTab) {
        return
      }

      if (
        this.currentStatus == "processing" ||
        this.currentStatus == "queued" ||
        this.currentStatus == "started"
      ) {
        // Skip polling if WebSocket is connected - real-time updates handle status
        if (!this.socketConnected) {
          await this.getJobsList()
        }

        this.pollingJob = setTimeout(
          () => this.pollingGeneration(false, currentTab),
          10000,
        )
      }

      if (this.currentStatus == "complete" && !first) {
        this.getPreview()
      }
    },
    reloadGeneration() {
      this.initGeneration(true)
    },
    async getJobsList() {
      this.jobsList = await apiGetMetadataLLMService(this.conversationId)
    },
    async getLastUpdate() {
      const res = await apiGetConversationLastUpdate(this.conversationId)
      this.conv_last_update = res.last_update
    },
    // Versioning methods - use jobId to proxy to LLM Gateway
    async loadVersions() {
      if (!this.conversationId || !this.currentJob?.jobId) return
      try {
        const jobId = this.currentJob.jobId
        this.savedVersions = await apiListExportVersions(
          this.conversationId,
          jobId,
        )
      } catch (e) {
        console.error("Error loading versions:", e)
        this.savedVersions = []
      }
    },
    async loadVersion(version) {
      try {
        const jobId = this.currentJob?.jobId
        if (!jobId) return

        const versionData = await apiGetExportVersion(
          this.conversationId,
          jobId,
          version.version_number,
        )
        if (versionData && versionData.content) {
          this.markdownContent = versionData.content
          this.$refs.publishContent?.markAsSaved()
        }
      } catch (e) {
        console.error("Error loading version:", e)
      }
    },
    async saveVersion() {
      // Save edited content as a new version in LLM Gateway
      try {
        const jobId = this.currentJob?.jobId
        if (!jobId) return

        const content =
          this.$refs.publishContent?.getContent() || this.markdownContent
        const result = await apiUpdateExportResult(
          this.conversationId,
          jobId,
          content,
        )
        if (result) {
          this.$refs.publishContent?.markAsSaved()
          await this.loadVersions()
          // Auto-select the newly created version (highest version number)
          if (this.savedVersions && this.savedVersions.length > 0) {
            const newVersionNumber = Math.max(
              ...this.savedVersions.map((v) => v.version_number),
            )
            this.currentVersionNumber = newVersionNumber
          }
          // Show success notification
          this.$store.dispatch("system/addNotification", {
            type: "success",
            message: this.$t("publish.editor.version_saved"),
          })
        } else {
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: this.$t("publish.editor.version_save_error"),
          })
        }
      } catch (e) {
        console.error("Error saving version:", e)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.editor.version_save_error"),
        })
      }
    },
    async restoreVersion(version) {
      // Restore a specific version from LLM Gateway
      if (!confirm(this.$t("publish.editor.restore_version_confirm"))) return
      try {
        const jobId = this.currentJob?.jobId
        if (!jobId) return

        const result = await apiRestoreExportVersion(
          this.conversationId,
          jobId,
          version.version_number,
        )
        if (result && result.content) {
          this.markdownContent = result.content
          this.$refs.publishContent?.markAsSaved()
          await this.loadVersions()
          this.$store.dispatch("system/addNotification", {
            type: "success",
            message: this.$t("publish.editor.version_restored"),
          })
        } else {
          this.$store.dispatch("system/addNotification", {
            type: "error",
            message: this.$t("publish.editor.version_restore_error"),
          })
        }
      } catch (e) {
        console.error("Error restoring version:", e)
        this.$store.dispatch("system/addNotification", {
          type: "error",
          message: this.$t("publish.editor.version_restore_error"),
        })
      }
    },
    onContentChange(content) {
      this.editedContent = content
    },
    formatDate(dateString) {
      if (!dateString) return ""
      return moment(dateString).format("YYYY-MM-DD HH:mm")
    },
    // Generation methods
    async loadGenerations() {
      const serviceId = this.selectedRoute || this.activeTab
      if (
        !this.conversationId ||
        this.activeTab === "verbatim" ||
        this.activeTab === "publication" ||
        !serviceId
      ) {
        this.generations = []
        this.currentGenerationId = null
        return
      }
      try {
        this.generations = await apiListGenerations(
          this.conversationId,
          serviceId,
        )
        // Set current generation
        const current = this.generations.find((g) => g.isCurrent)
        if (current) {
          this.currentGenerationId = current.generationId
          // Sync jobId in jobsList with the current generation's jobId
          // This ensures export works correctly even if conversationExport was out of sync
          if (current.jobId) {
            const existingJobIndex = this.jobsList.findIndex(
              (j) => j.format === serviceId,
            )
            if (
              existingJobIndex !== -1 &&
              this.jobsList[existingJobIndex].jobId !== current.jobId
            ) {
              this.$set(this.jobsList, existingJobIndex, {
                ...this.jobsList[existingJobIndex],
                jobId: current.jobId,
              })
            }
          }
        } else if (this.generations.length > 0) {
          // Fallback to the most recent generation
          this.currentGenerationId = this.generations[0].generationId
          // Also sync jobId for the most recent generation
          const mostRecent = this.generations[0]
          if (mostRecent.jobId) {
            const existingJobIndex = this.jobsList.findIndex(
              (j) => j.format === serviceId,
            )
            if (existingJobIndex !== -1) {
              this.$set(this.jobsList, existingJobIndex, {
                ...this.jobsList[existingJobIndex],
                jobId: mostRecent.jobId,
              })
            }
          }
        }
      } catch (e) {
        console.error("Error loading generations:", e)
        this.generations = []
      }
    },
    async selectGeneration(generationId) {
      this.currentGenerationId = generationId
      const generation = this.generations.find(
        (g) => g.generationId === generationId,
      )
      if (generation) {
        // Update currentJob to use the selected generation's jobId
        // Find and update the job in jobsList
        const existingJobIndex = this.jobsList.findIndex(
          (j) => j.format === (this.selectedRoute || this.activeTab),
        )
        if (existingJobIndex !== -1) {
          this.$set(this.jobsList, existingJobIndex, {
            ...this.jobsList[existingJobIndex],
            jobId: generation.jobId,
          })
        }
        // Load versions for that generation
        await this.loadVersions()
        // Automatically select and load the latest version of this generation
        if (this.savedVersions && this.savedVersions.length > 0) {
          await this.selectLatestVersion()
        } else {
          // No versions yet, load the raw generation content
          this.currentVersionNumber = null
          await this.getPreview(false)
        }
      }
    },
    async handleSelectVersion({ generationId, versionNumber }) {
      // First ensure we're on the right generation
      if (generationId !== this.currentGenerationId) {
        await this.selectGeneration(generationId)
      }
      // Then load the specific version
      await this.loadVersionByNumber(versionNumber)
    },
    async loadVersionByNumber(versionNumber) {
      const version = this.savedVersions.find(
        (v) => v.version_number === versionNumber,
      )
      if (version) {
        this.currentVersionNumber = versionNumber
        await this.loadVersion(version)
      }
    },
    async selectLatestVersion() {
      // Select and load the latest version if available
      if (this.savedVersions && this.savedVersions.length > 0) {
        const latestVersionNumber = Math.max(
          ...this.savedVersions.map((v) => v.version_number),
        )
        await this.loadVersionByNumber(latestVersionNumber)
      } else {
        this.currentVersionNumber = null
      }
    },
    confirmRegenerate() {
      this.showRegenerateConfirm = true
    },
    async executeRegenerate() {
      this.showRegenerateConfirm = false
      await this.initGeneration(true)
      await this.loadGenerations()
    },
    // Socket.io methods
    initSocket() {
      // Use the existing socket from the app if available (ApiEventWebSocket)
      if (this.$apiEventWS && this.$apiEventWS.socket) {
        this.socket = this.$apiEventWS.socket
        this.setupSocketListeners()
      }
    },
    setupSocketListeners() {
      if (!this.socket) return

      // Server -> Client events: llm:job:update, llm:job:complete, llm:job:error
      this.socket.on("llm:job:update", this.handleJobUpdate)
      this.socket.on("llm:job:complete", this.handleJobComplete)
      this.socket.on("llm:job:error", this.handleJobError)
    },
    joinLlmRoom() {
      // Join the LLM room for this organization (called after conversation loads)
      if (!this.socket || this.socketConnected) return

      const organizationId = this.conversation?.organization?.organizationId
      if (organizationId) {
        this.socket.emit("llm:join", {
          organizationId,
          conversationId: this.conversationId,
        })
        this.socketConnected = true
      }
    },
    handleJobUpdate(update) {
      // Update the job status in real-time
      // Check conversationId if provided, otherwise check if jobId is in our list
      if (
        update.conversationId &&
        update.conversationId !== this.conversationId
      )
        return

      const jobIndex = this.jobsList.findIndex((j) => j.jobId === update.jobId)
      if (jobIndex !== -1) {
        // Update existing job
        // Map backend status to frontend status: 'started' -> 'processing'
        const mappedStatus = update.status === 'started' ? 'processing' : update.status
        this.$set(this.jobsList, jobIndex, {
          ...this.jobsList[jobIndex],
          status: mappedStatus,
          processing: update.progress?.percentage || 0,
          phase: update.progress?.phase || null,
        })
      } else if (
        update.conversationId === this.conversationId &&
        (update.serviceFormat || update.serviceName || update.format)
      ) {
        // New job for this conversation - find matching format and update jobId
        // WebSocket sends 'format', but for compatibility also check serviceFormat/serviceName
        const updateFormat =
          update.serviceFormat || update.serviceName || update.format
        const formatIndex = this.jobsList.findIndex(
          (j) => j.format === updateFormat,
        )
        if (formatIndex !== -1) {
          this.$set(this.jobsList, formatIndex, {
            ...this.jobsList[formatIndex],
            jobId: update.jobId,
            status: update.status,
            processing: update.progress?.percentage || 0,
          })
        }
      }
    },
    async handleJobComplete(update) {
      // Handle job completion
      // Check conversationId if provided, otherwise check if jobId is in our list
      if (
        update.conversationId &&
        update.conversationId !== this.conversationId
      ) {
        return
      }

      let jobIndex = this.jobsList.findIndex((j) => j.jobId === update.jobId)

      // If not found by jobId, try to match by format
      // WebSocket sends 'format', but for compatibility also check serviceFormat/serviceName
      if (
        jobIndex === -1 &&
        update.conversationId === this.conversationId &&
        (update.serviceFormat || update.serviceName || update.format)
      ) {
        const updateFormat =
          update.serviceFormat || update.serviceName || update.format
        jobIndex = this.jobsList.findIndex((j) => j.format === updateFormat)
      }

      if (jobIndex !== -1) {
        this.$set(this.jobsList, jobIndex, {
          ...this.jobsList[jobIndex],
          jobId: update.jobId,
          status: "complete",
          processing: 100,
        })

        // Refresh the generations timeline, versions and preview when job completes
        await this.loadGenerations()
        await this.loadVersions()
        await this.getPreview()
      }
    },
    handleJobError(update) {
      // Handle job error
      if (
        update.conversationId &&
        update.conversationId !== this.conversationId
      )
        return

      let jobIndex = this.jobsList.findIndex((j) => j.jobId === update.jobId)

      // If not found by jobId, try to match by format
      // WebSocket sends 'format', but for compatibility also check serviceFormat/serviceName
      if (
        jobIndex === -1 &&
        update.conversationId === this.conversationId &&
        (update.serviceFormat || update.serviceName || update.format)
      ) {
        const updateFormat =
          update.serviceFormat || update.serviceName || update.format
        jobIndex = this.jobsList.findIndex((j) => j.format === updateFormat)
      }

      if (jobIndex !== -1) {
        this.$set(this.jobsList, jobIndex, {
          ...this.jobsList[jobIndex],
          status: "error",
          error: update.error,
        })
      }
    },
    cleanupSocket() {
      if (!this.socket) return

      const organizationId = this.conversation?.organization?.organizationId
      if (organizationId) {
        // Client -> Server: llm:leave
        this.socket.emit("llm:leave", {
          organizationId,
          conversationId: this.conversationId,
        })
      }

      this.socket.off("llm:job:update", this.handleJobUpdate)
      this.socket.off("llm:job:complete", this.handleJobComplete)
      this.socket.off("llm:job:error", this.handleJobError)
      this.socketConnected = false
    },
  },
  components: {
    TranscriptionHelper,
    Loading,
    UserInfoInline,
    AppEditor,
    MainContentConversation,
    MenuToolbox,
    CustomSelect,
    SwitchInput,
    Tabs,
    ConversationPublishContent,
    AppEditorChannelsSelector,
    AppEditorTranslationSelector,
    PopoverList,
    GenerationTimeline,
    AIServiceMenu,
    PublicationSection,
    Modal,
    Button,
  },
}
</script>
