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
      <div style="margin: 0 1rem" class="flex col gap-medium">
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
          <!-- Always show regenerate button -->
          <button class="yellow fullwidth" @click="reloadGeneration">
            <span class="icon reload"></span>
            <span class="label">{{ $t("publish.reload_document") }}</span>
          </button>
        </section>

        <!-- Versions Section -->
        <section v-if="isEditableOutput && currentStatus === 'complete'" class="versions-section">
          <h3 class="sidebar-section-title">{{ $t("publish.editor.versions_list") }}</h3>
          <div v-if="savedVersions.length === 0" class="no-versions">
            {{ $t("publish.editor.no_versions") }}
          </div>
          <div v-else class="versions-list">
            <div
              v-for="version in savedVersions"
              :key="version.version_number"
              class="version-item flex align-center gap-small"
              @click="loadVersion(version)">
              <span class="version-name flex1">{{ $t('publish.editor.version_label', { version: version.version_number }) }}</span>
              <span class="version-date">{{ formatDate(version.created_at) }}</span>
              <button
                type="button"
                class="btn-icon-sm"
                @click.stop="restoreVersion(version)"
                :title="$t('publish.editor.restore_version')">
                <span class="icon undo"></span>
              </button>
            </div>
          </div>
          <button
            v-if="hasContentChanges"
            class="primary fullwidth margin-top-small"
            @click="showSaveVersionModal = true">
            <span class="icon save"></span>
            <span class="label">{{ $t("publish.editor.save_version") }}</span>
          </button>
        </section>
      </div>
    </template>

    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small reset-overflows align-center">
        <PopoverList
          :items="optionsExport"
          style="margin-left: auto"
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
      <!-- Category tabs if services have categories -->
      <div v-if="hasCategories" class="category-tabs flex gap-small margin-bottom-small">
        <button
          v-for="category in availableCategories"
          :key="category"
          type="button"
          class="category-tab"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category">
          {{ $t(`publish.category.${category}`) || category }}
        </button>
      </div>
      <Tabs
        v-model="activeTab"
        :tabs="filteredTabs"
        v-if="filteredTabs && filteredTabs.length > 0"></Tabs>
      <ConversationPublishContent
        ref="publishContent"
        :mardownContent="mardownContent"
        :status="currentStatus"
        :blobUrl="blobUrl"
        :pdfPercentage="generationPercentage"
        :editable="isEditableOutput"
        @content-change="onContentChange" />
    </div>

    <!-- Save Version Modal -->
    <div v-if="showSaveVersionModal" class="modal-overlay" @click.self="showSaveVersionModal = false">
      <div class="modal-content">
        <h3>{{ $t("publish.editor.save_version_title") }}</h3>
        <input
          type="text"
          v-model="newVersionName"
          :placeholder="$t('publish.editor.version_name_placeholder')"
          class="fullwidth margin-bottom-small" />
        <div class="flex gap-small justify-end">
          <button type="button" class="secondary" @click="showSaveVersionModal = false">
            {{ $t("common.cancel") }}
          </button>
          <button type="button" class="primary" @click="saveVersion" :disabled="!newVersionName">
            {{ $t("publish.editor.save_version") }}
          </button>
        </div>
      </div>
    </div>
  </MainContentConversation>
</template>
<script>
import moment from "moment"
import { jsPDF } from "jspdf"

import { conversationMixin } from "../mixins/conversation.js"
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
export default {
  mixins: [conversationMixin],
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
      mardownContent: null,
      // Versioning
      savedVersions: [],
      showSaveVersionModal: false,
      newVersionName: "",
      editedContent: null,
      // Categories
      selectedCategory: null,
      // Socket.io
      socket: null,
      socketConnected: false,
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
      this.initGeneration()
      this.loadVersions()
    },
  },
  computed: {
    hasContentChanges() {
      return this.$refs.publishContent?.hasUnsavedChanges() || false
    },
    hasCategories() {
      const categories = Object.values(this.indexedFormat)
        .map(s => s.service_category)
        .filter(Boolean)
      return categories.length > 0
    },
    availableCategories() {
      const categories = new Set()
      Object.values(this.indexedFormat).forEach(service => {
        if (service.service_category) {
          categories.add(service.service_category)
        }
      })
      // Add 'other' for services without category
      const hasUncategorized = Object.values(this.indexedFormat).some(s => !s.service_category)
      if (hasUncategorized) {
        categories.add('other')
      }
      return Array.from(categories)
    },
    filteredTabs() {
      if (!this.hasCategories || !this.selectedCategory) {
        return this.tabs
      }
      return this.tabs.filter(tab => {
        const service = this.indexedFormat[tab.name]
        if (this.selectedCategory === 'other') {
          return !service?.service_category
        }
        return service?.service_category === this.selectedCategory
      })
    },
    optionsExport() {
      switch (this.activeTab) {
        case "verbatim":
        case "docx":
        case "cri":
          return [
            { value: "docx", text: this.$t("conversation.export.docx") },
            { value: "pdf", text: this.$t("conversation.export.pdf") },
            { value: "txt", text: this.$t("conversation.export.txt") },
            { value: "json", text: this.$t("conversation.export.json") },
          ]

        default:
          if (this.mardownContent) {
            return [
              { value: "md", text: this.$t("conversation.export.md") },
              // { value: "pdf", text: this.$t("conversation.export.pdf") },
            ]
          }
          return [
            { value: "docx", text: this.$t("conversation.export.docx") },
            { value: "pdf", text: this.$t("conversation.export.pdf") },
            // { value: 'txt', text: $t('conversation.export.txt') },
            // { value: 'json', text: $t('conversation.export.json') },
          ]
      }
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
        ]

        this.activeTab = resWithCri[0].name
        return resWithCri
      } else {
        this.activeTab = "verbatim"
      }
      return res
    },
    selectedFlavor() {
      // return string like "llama3"
      return this.indexedFormat[this.activeTab]?.flavors?.[0]?.name
    },
    outputFormating() {
      // abstractive / markdown / text
      return this.indexedFormat[this.activeTab]?.flavors?.[0]?.output_type
    },
    isEditableOutput() {
      // Text and markdown outputs can be edited, PDF/abstractive cannot
      return ['text', 'markdown'].includes(this.outputFormating)
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
    breadcrumbItems() {
      return [
        {
          label: this.rootConversation?.name ?? "",
          // to: {
          //   name: "conversations overview",
          //   params: { conversationId: this.conversationId },
          // },
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
  },
  methods: {
    initConversationHook() {
      // this.initGeneration()
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
        case "pdf":
          this.exportPdf()
          break
        case "md":
          this.exportMarkdown()
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

        // Set initial category if categories exist
        if (this.hasCategories && this.availableCategories.length > 0) {
          this.selectedCategory = this.availableCategories[0]
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingServices = false
      }
    },
    async getPreview(regenerate = false) {
      let currentTab = this.activeTab
      this.mardownContent = null
      this.blobUrl = null
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
          this.blobUrl = null
          return
        } else if (req.data.type === "application/pdf") {
          this.blobUrl = URL.createObjectURL(req.data)
        } else if (req.data.type === "text/plain") {
          this.blobUrl = null
          this.mardownContent = await req.data.text()
        } else {
          this.blobUrl = null
          console.log("error", req)
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
        this.savedVersions = await apiListExportVersions(this.conversationId, jobId)
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
          version.version_number
        )
        if (versionData && versionData.content) {
          this.mardownContent = versionData.content
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

        const content = this.$refs.publishContent?.getContent() || this.mardownContent
        const result = await apiUpdateExportResult(
          this.conversationId,
          jobId,
          content
        )
        if (result) {
          this.$refs.publishContent?.markAsSaved()
          this.showSaveVersionModal = false
          this.newVersionName = ""
          await this.loadVersions()
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
          version.version_number
        )
        if (result && result.content) {
          this.mardownContent = result.content
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
      if (update.conversationId && update.conversationId !== this.conversationId) return

      const jobIndex = this.jobsList.findIndex(j => j.jobId === update.jobId)
      if (jobIndex !== -1) {
        // Update existing job
        this.$set(this.jobsList, jobIndex, {
          ...this.jobsList[jobIndex],
          status: update.status,
          processing: update.progress?.percentage || 0,
        })
      } else if (update.conversationId === this.conversationId && (update.serviceFormat || update.serviceName)) {
        // New job for this conversation - find matching format and update jobId
        const formatIndex = this.jobsList.findIndex(j =>
          j.format === update.serviceFormat || j.format === update.serviceName
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
    handleJobComplete(update) {
      // Handle job completion
      // Check conversationId if provided, otherwise check if jobId is in our list
      if (update.conversationId && update.conversationId !== this.conversationId) return

      let jobIndex = this.jobsList.findIndex(j => j.jobId === update.jobId)

      // If not found by jobId, try to match by format
      if (jobIndex === -1 && update.conversationId === this.conversationId && (update.serviceFormat || update.serviceName)) {
        jobIndex = this.jobsList.findIndex(j =>
          j.format === update.serviceFormat || j.format === update.serviceName
        )
      }

      if (jobIndex !== -1) {
        this.$set(this.jobsList, jobIndex, {
          ...this.jobsList[jobIndex],
          jobId: update.jobId,
          status: "complete",
          processing: 100,
        })

        // Refresh the preview when job completes
        this.getPreview()
      }
    },
    handleJobError(update) {
      // Handle job error
      if (update.conversationId && update.conversationId !== this.conversationId) return

      let jobIndex = this.jobsList.findIndex(j => j.jobId === update.jobId)

      // If not found by jobId, try to match by format
      if (jobIndex === -1 && update.conversationId === this.conversationId && (update.serviceFormat || update.serviceName)) {
        jobIndex = this.jobsList.findIndex(j =>
          j.format === update.serviceFormat || j.format === update.serviceName
        )
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
    // ConversationPublishVerbatim,
    // ConversationPublishCra,
    // ConversationPublishCri,
    ConversationPublishContent,
    AppEditorChannelsSelector,
    AppEditorTranslationSelector,
    PopoverList,
  },
}
</script>
