<template>
  <MainContentConversation
    :conversation="conversation"
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
      <div style="margin: 0 1rem" class="flex col">
        <!-- <h2>{{ $t(`publish.filter_title.${activeTab}`) }}</h2> -->
        <section v-if="isUpdated">
          <div class="flex align-center gap-small">
            <span class="icon done"></span>
            <span>
              {{ $t("publish.is_updated") }}
            </span>
          </div>
        </section>
        <section v-else class="flex col gap-medium">
          <div class="flex align-center gap-small">
            <span class="icon warning"></span>
            <span>
              {{ $t("publish.is_not_updated") }}
            </span>
          </div>
          <button class="yellow fullwidth" @click="reloadGeneration">
            <span class="icon reload"></span>
            <span class="label">{{ $t("publish.reload_document") }}</span>
          </button>
        </section>
      </div>
    </template>

    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small reset-overflows align-center">
        <router-link :to="conversationListRoute" class="btn secondary">
          <span class="icon close"></span>
          <span class="label">{{ $t("conversation.close_publish") }}</span>
        </router-link>
        <router-link
          :to="{
            name: 'conversations transcription',
            params: { conversationId: conversation._id },
          }"
          class="btn">
          <span class="icon back"></span>
          <span class="label">{{ $t("conversation.return_to_editor") }}</span>
        </router-link>

        <h1
          class="flex1 center-text text-cut"
          style="padding-left: 1rem; padding-right: 1rem">
          {{ conversation.name }}
        </h1>
        <CustomSelect
          :valueText="$t('conversation.export.title')"
          iconType="icon"
          icon="upload"
          value=""
          :disabled="currentStatus !== 'complete' || loadingDownload"
          :options="optionsExport"
          buttonClass="green"
          @input="exportConv"></CustomSelect>
      </div>
    </template>

    <div class="publish-main-container flex col" v-if="dataLoaded">
      <Tabs
        v-model="activeTab"
        :tabs="tabs"
        v-if="tabs && tabs.length > 0"></Tabs>
      <ConversationPublishContent
        :mardownContent="mardownContent"
        :status="currentStatus"
        :blobUrl="blobUrl"
        :pdfPercentage="generationPercentage" />
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
import { getLLMService, apiGetMetadataLLMService } from "@/api/service.js"

import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"

import Loading from "@/components/Loading.vue"
import Modal from "@/components/Modal.vue"
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
import AppEditorTranslationSelector from "../components/AppEditorTranslationSelector.vue"

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
    }
  },
  mounted() {
    this.getLastUpdate()
    this.getServices()
  },
  beforeDestroy() {
    clearTimeout(this.pollingJob)
    this.activeTab = "destroyed"
  },
  watch: {
    dataLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
      }
    },
    async activeTab(newVal, oldVal) {
      this.initGeneration()
    },
  },
  computed: {
    optionsExport() {
      switch (this.activeTab) {
        case "verbatim":
        case "docx":
        case "cri":
          return {
            actions: [
              { value: "docx", text: this.$t("conversation.export.docx") },
              { value: "pdf", text: this.$t("conversation.export.pdf") },
              { value: "txt", text: this.$t("conversation.export.txt") },
              { value: "json", text: this.$t("conversation.export.json") },
            ],
          }
          break

        default:
          if (this.mardownContent) {
            return {
              actions: [
                { value: "md", text: this.$t("conversation.export.md") },
                { value: "pdf", text: this.$t("conversation.export.pdf") },
              ],
            }
          }
          return {
            actions: [
              { value: "docx", text: this.$t("conversation.export.docx") },
              { value: "pdf", text: this.$t("conversation.export.pdf") },
              // { value: 'txt', text: $t('conversation.export.txt') },
              // { value: 'json', text: $t('conversation.export.json') },
            ],
          }
          break
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
          icon: "text",
        }
      })

      if (res && res.length > 0) {
        const resWithCri = [
          {
            name: "verbatim",
            label: this.$i18n.t(`publish.tabs.verbatim`),
            icon: "text",
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
      return this.indexedFormat[this.activeTab]?.flavor[0].name
    },
    outputFormating() {
      // abstractive / markdown
      return this.indexedFormat[this.activeTab]?.flavor[0].type
    },
    selectedRoute() {
      return this.indexedFormat[this.activeTab]?.route
    },
    currentJob() {
      return this.jobsList.find((item) => item.format === this.activeTab)
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
    exportConv(value) {
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
          res[format]["flavor"] = service.flavor
          res[format]["description"] = service.description
          res[format]["route"] = service.route
          res[format]["format"] = service.format
        }
        this.indexedFormat = res
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
          preview: this.outputFormating !== "markdown",
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
        await this.getJobsList()

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
  },
  components: {
    TranscriptionHelper,
    Loading,
    Modal,
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
  },
}
</script>
