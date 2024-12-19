<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
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
          <button class="yellow fullwidth" @click="reloadPdf">
            <span class="icon reload"></span>
            <span class="label">{{ $t("publish.reload_document") }}</span>
          </button>
        </section>

        <!-- <section v-if="conversation.speakers.length > 1">
          <h3 for="template-format-list">
            {{ $t("publish.filter_speaker.title") }}
          </h3>

          <div
            v-for="speaker of conversation.speakers"
            class="flex speaker-filter-item"
            style="margin: 0.25rem 0rem">
            <label
              :for="'filter-speaker-' + speaker.speaker_id"
              class="flex1"
              >{{ speaker.speaker_name }}</label
            >
            <SwitchInput
              :checkboxValue="speaker.speaker_id"
              v-model="filterSpeakers"
              :id="'filter-speaker-' + speaker.speaker_id"
              name="filter-speakers"
              style="margin-right: 0.5rem" />
          </div>
        </section> -->
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
          :disabled="pdfStatus !== 'displayed' || loadingDownload"
          aria-label="select how to open the conversation"
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
      <!-- <div class="publish-turn-list">
        <h1>{{ conversation.name }}</h1>
        <h2>Transcription</h2>
        <PublishTurn
          v-for="turn of turns"
          :key="turn.turn_id"
          :turn="turn"
          :speakerIndexedBySpeakerId="speakerIndexedBySpeakerId" />
      </div> -->
      <ConversationPublishContent
        :status="pdfStatus"
        :blobUrl="blobUrl"
        :format="activeTab"
        :conversationId="conversationId"
        :conversation="conversation"
        :filterSpeakers="filterSpeakers"
        :service="selectedService"
        :pdfPercentage="pdfPercentage"
        :filterTags="filterTags" />
      <!-- <component
        :is="mainComponentName"
        :conversation="conversation"
        :conversationId="conversationId"></component> -->
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
      speakerIndexedBySpeakerId: {},
      helperVisible: false,
      pdfStatus: null,
      status: null,
      filterTags: [],
      activeTab: "",
      loading: false,
      blobUrl: null,
      indexedFormat: {},
      loadingServices: true,
      metadataList: [],
      conv_last_update: null,
      currentTabId: null,
      loadingDownload: false,
      pdfPercentageIndexByFormat: {},
      pdfPercentage: 0,
    }
  },
  mounted() {
    this.getLastUpdate()
    this.getServices()
    this.getMetadata()
  },
  watch: {
    dataLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
        this.filterSpeakers = this.conversation.speakers.map(
          (speaker) => speaker.speaker_id,
        )
        this.speakerIndexedBySpeakerId = this.conversation.speakers.reduce(
          (acc, speaker) => {
            acc[speaker.speaker_id] = speaker
            return acc
          },
          {},
        )
        if (this.status !== "done") {
          this.$router.push(`/interface/conversations/${this.conversation._id}`)
        }
      }
    },
    activeTab(newVal, oldVal) {
      this.getPdf()
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
    mainComponentName() {
      return `ConversationPublish${
        this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1)
      }`
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
    currentInfoFormat() {
      return this.metadataList.find((item) => item.format === this.activeTab)
    },
    isUpdated() {
      const infoFormat = this.currentInfoFormat

      if (infoFormat) {
        if (infoFormat.status === "error") {
          return false
        }
        const format_last_update = new Date(infoFormat.last_update)
        const conversation_last_update = new Date(this.conv_last_update)
        return format_last_update >= conversation_last_update
      }
      return true
    },
    label_format() {
      return this.tabs.find((tab) => tab.name === this.activeTab)?.label
    },
  },
  methods: {
    showHelper() {
      this.helperVisible = true
    },
    closeHelper() {
      this.helperVisible = false
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
        }
        this.indexedFormat = res
      } catch (e) {
        console.error(e)
      } finally {
        this.loadingServices = false
        //this.getPdf()
      }
    },
    async getPdf(regenerate = false) {
      this.pdfStatus = "processing"
      // generate random id
      this.currentTabId = Math.random()
      /*
      this.filterSpeakers,
        this.filterTags
      */
      if (
        this.pdfPercentageIndexByFormat[this.activeTab] === undefined ||
        regenerate
      ) {
        this.pdfPercentageIndexByFormat[this.activeTab] = 0
      }

      this.pdfPercentage = this.pdfPercentageIndexByFormat[this.activeTab]

      const currentActiveTab = this.currentTabId

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

      await this.getMetadata()

      if (this.currentTabId !== currentActiveTab) {
        return
      }

      if (this.currentInfoFormat && this.currentInfoFormat.status === "error") {
        console.log("error", req)
        this.pdfStatus = "error"
        return
      }

      if (req?.status === "success") {
        // test if req.data as blob is json or not
        if (req.data.type === "application/json") {
          this.pdfStatus = JSON.parse(await req.data.text())?.status
          this.pdfPercentageIndexByFormat[this.activeTab] = JSON.parse(
            await req.data.text(),
          )?.processing
          this.pdfPercentage = this.pdfPercentageIndexByFormat[this.activeTab]

          if (this.pdfStatus === "processing" || this.pdfStatus === "queued") {
            setTimeout(() => {
              if (this.currentTabId === currentActiveTab) this.getPdf()
            }, 5000)
          }
        } else if (req.data.type === "application/pdf") {
          this.blobUrl = URL.createObjectURL(req.data)
          this.pdfStatus = "displayed"
        } else {
          console.log("error", req)
          this.pdfStatus = "error"
        }
      } else {
        console.log("error", req)
        this.pdfStatus = "error"
      }
      this.loading = false
    },
    reloadPdf() {
      this.getPdf(true)
    },
    async getMetadata() {
      this.metadataList = await apiGetMetadataLLMService(this.conversationId)
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
