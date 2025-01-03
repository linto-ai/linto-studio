<template>
  <MainContentConversation
    :conversation="conversation"
    :status="conversationStatus"
    :dataLoaded="dataLoaded"
    :dataLoadedStatus="dataLoadedStatus"
    :error="error"
    :sidebar="true">
    <template v-slot:sidebar>
      <div
        class="form-field flex col medium-margin"
        v-if="conversationType === 'child'">
        <AppEditorChannelsSelector
          :channels="channels"
          v-model="selectedChannel" />
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
        :status="currentStatus"
        :blobUrl="blobUrl"
        :format="activeTab"
        :conversationId="conversationId"
        :conversation="conversation"
        :filterSpeakers="filterSpeakers"
        :service="selectedService"
        :pdfPercentage="generationPercentage"
        :filterTags="filterTags" />
    </div>
  </MainContentConversation>
</template>
<script>
import moment from "moment"
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
import UserInfoInline from "@/components/UserInfoInline.vue"
import AppEditor from "@/components/AppEditor.vue"
import MainContentConversation from "@/components/MainContentConversation.vue"
import MenuToolbox from "@/components/MenuToolbox.vue"
import CustomSelect from "@/components/CustomSelect.vue"
import SwitchInput from "@/components/SwitchInput.vue"
import PublishTurn from "@/components/PublishTurn.vue"
import Tabs from "@/components/Tabs.vue"
import ConversationShare from "@/components/ConversationShare.vue"
import TranscriptionHelper from "@/components/TranscriptionHelper.vue"
import ConversationPublishContent from "@/components/ConversationPublishContent.vue"
import AppEditorChannelsSelector from "@/components/AppEditorChannelsSelector.vue"

export default {
  mixins: [conversationMixin],
  data() {
    return {
      selfUrl: (convId) => `/interface/conversations/${convId}/publish`,
      conversationId: "",
      filterSpeakers: [],
      conversationStatus: null,
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
        this.conversationStatus = this.computeStatus(
          this.conversation?.jobs?.transcription,
        )
        this.filterSpeakers = this.conversation.speakers.map(
          (speaker) => speaker.speaker_id,
        )
        if (this.conversationStatus !== "done") {
          this.$router.push(`/interface/conversations/${this.conversation._id}`)
        }
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
    selectedService() {
      // return string like "llama3"
      return this.indexedFormat[this.activeTab]?.services[0]
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
      console.log("p", this?.currentJob?.status)
      return this?.currentJob?.status || "queued"
    },
    generationPercentage() {
      return Number(this?.currentJob?.processing || 0)
    },
  },
  methods: {
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
        default:
          break
      }
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
        this.selectedService,
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
    async exportPdf() {
      this.loadingDownload = true
      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.selectedRoute || this.activeTab,
        this.selectedService,
        {
          preview: true,
          title: this.label_format,
        },
      )

      if (req?.status === "success") {
        this.exportBlobFile(req.data, ".pdf")
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
          res[format]["services"] = service.flavor.map((flavor) => flavor.name)
          res[format]["description"] = service.description
          res[format]["route"] = service.route
        }
        this.indexedFormat = res
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingServices = false
      }
    },
    async getPreview(regenerate = false) {
      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.selectedRoute || this.activeTab,
        this.selectedService,
        {
          preview: true,
          title: this.label_format,
          regenerate,
        },
      )
      if (req?.status === "success") {
        if (req.data.type === "application/json") {
          this.blobUrl = null
          return
        } else if (req.data.type === "application/pdf") {
          this.blobUrl = URL.createObjectURL(req.data)
        } else {
          this.blobUrl = null
          console.log("error", req)
        }
      }
    },
    async pollingGeneration(first = false, currentTab) {
      if (currentTab === "destroy" || currentTab !== this.activeTab) {
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
          0,
        )
      }

      if (this.currentStatus == "complete" && !first) {
        this.getPreview()
      }
    },
    reloadGeneration() {
      this.initGeneration(true)
    },
    async getJobsList(immediate = false) {
      this.jobsList = await apiGetMetadataLLMService(
        this.conversationId,
        immediate,
      )
    },
    async getLastUpdate() {
      const res = await apiGetConversationLastUpdate(this.conversationId)
      this.conv_last_update = res.last_update
    },
  },
  components: {
    ConversationShare,
    TranscriptionHelper,
    Loading,
    Modal,
    UserInfoInline,
    AppEditor,
    MainContentConversation,
    MenuToolbox,
    CustomSelect,
    SwitchInput,
    PublishTurn,
    Tabs,
    // ConversationPublishVerbatim,
    // ConversationPublishCra,
    // ConversationPublishCri,
    ConversationPublishContent,
    AppEditorChannelsSelector,
  },
}
</script>
