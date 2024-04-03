<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="dataLoaded"
    :error="error"
    :sidebar="true">
    <template v-slot:sidebar>
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
        <router-link :to="conversationListRoute" class="btn">
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
          :disabled="pdfStatus !== 'displayed'"
          aria-label="select how to open the conversation"
          :options="{
            actions: [
              { value: 'docx', text: $t('conversation.export.docx') },
              // { value: 'txt', text: $t('conversation.export.txt') },
              // { value: 'json', text: $t('conversation.export.json') },
            ],
          }"
          buttonClass="green"
          @input="exportConv"></CustomSelect>
      </div>
    </template>

    <div class="publish-main-container flex col" v-if="dataLoaded">
      <Tabs v-model="activeTab" :tabs="tabs" v-if="tabs"></Tabs>
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
        :filterTags="filterTags" />
      <!-- <component
        :is="mainComponentName"
        :conversation="conversation"
        :conversationId="conversationId"></component> -->
    </div>
  </MainContentConversation>
</template>
<script>
import ConversationShare from "@/components/ConversationShare.vue"
import TranscriptionHelper from "@/components/TranscriptionHelper.vue"
import moment from "moment"
import { conversationMixin } from "../mixins/conversation.js"
import {
  apiGetJsonFileFromConversation,
  apiGetTextFileFromConversation,
  apiGetDocxFileFromConversation,
  apiGetGenericFileFromConversation,
  apiGetConversationLastUpdate,
} from "../api/conversation.js"

import Loading from "@/components/Loading.vue"
import Modal from "@/components/Modal.vue"
import UserInfoInline from "@/components/UserInfoInline.vue"
import AppEditor from "@/components/AppEditor.vue"
import ErrorView from "./Error.vue"
import MainContentConversation from "@/components/MainContentConversation.vue"
import MenuToolbox from "@/components/MenuToolbox.vue"
import CustomSelect from "@/components/CustomSelect.vue"
import SwitchInput from "@/components/SwitchInput.vue"
import PublishTurn from "@/components/PublishTurn.vue"
import Tabs from "@/components/Tabs.vue"
// import ConversationPublishVerbatim from "@/components/ConversationPublishVerbatim.vue"
// import ConversationPublishCra from "@/components/ConversationPublishCra.vue"
// import ConversationPublishCri from "@/components/ConversationPublishCri.vue"
import ConversationPublishContent from "../components/ConversationPublishContent.vue"
import { getLLMService, apiGetMetadataLLMService } from "@/api/service.js"

export default {
  mixins: [conversationMixin],
  data() {
    return {
      conversationId: "",
      filterSpeakers: [],
      speakerIndexedBySpeakerId: {},
      helperVisible: false,
      pdfStatus: null,
      status: null,
      filterTags: [],
      activeTab: "docx",
      loading: false,
      blobUrl: null,
      indexedFormat: {},
      loadingServices: true,
      metadataList: [],
      conv_last_update: null,
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
          (speaker) => speaker.speaker_id
        )
        this.speakerIndexedBySpeakerId = this.conversation.speakers.reduce(
          (acc, speaker) => {
            acc[speaker.speaker_id] = speaker
            return acc
          },
          {}
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
    dataLoaded() {
      return this.conversationLoaded && !this.loadingServices
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    exportFileTitle() {
      return `${this.conversation.name.replace(/\s/g, "_")}_${moment().format(
        "YYYYMMDDHHmmss"
      )}`
    },
    mainComponentName() {
      return `ConversationPublish${
        this.activeTab.charAt(0).toUpperCase() + this.activeTab.slice(1)
      }`
    },
    tabs() {
      const res = Object.keys(this.indexedFormat).map((format) => {
        return {
          name: format,
          label: this.$i18n.t(`publish.tabs.${format}`),
          icon: "text",
        }
      })
      if (res) {
        this.activeTab = res[0].name
      }
      return res
    },
    selectedService() {
      return this.indexedFormat[this.activeTab]?.services[0]?.name
    },
    isUpdated() {
      const infoFormat = this.metadataList.find(
        (item) => item.format === this.activeTab
      )

      if (infoFormat) {
        const format_last_update = new Date(infoFormat.last_update)
        const conversation_last_update = new Date(this.conv_last_update)
        return format_last_update >= conversation_last_update
      }
      return true
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
        default:
          break
      }
    },
    async exportJson() {
      let req = await apiGetJsonFileFromConversation(
        this.conversationId,
        this.filterSpeakers,
        this.filterTags
      )
      if (req?.status === "success") {
        this.exportFile(
          JSON.stringify(req?.data, null, 4),
          "application/json",
          ".json"
        )
      }
    },
    async exportText() {
      let req = await apiGetTextFileFromConversation(
        this.conversationId,
        this.filterSpeakers,
        this.filterTags
      )

      if (req?.status === "success") {
        this.exportFile(req.data, "text/plain", ".txt")
      }
    },
    async exportDocx() {
      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.activeTab,
        this.selectedService,
        {
          preview: false,
        }
      )

      if (req?.status === "success") {
        this.exportBlobFile(req.data, ".docx")
      }
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
          for (const format of service.formats) {
            if (res[format] === undefined) {
              res[format] = {}
            }
            if (res[format]["services"] === undefined) {
              res[format]["services"] = []
            }
            res[format]["services"].push({ name: service.serviceName })
          }
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
      this.pdfStatus = "generating"
      /*
      this.filterSpeakers,
        this.filterTags
      */
      const currentActiveTab = this.activeTab

      let req = await apiGetGenericFileFromConversation(
        this.conversationId,
        this.activeTab,
        this.selectedService,
        {
          preview: true,
          regenerate,
        }
      )

      await this.getMetadata()

      if (this.activeTab !== currentActiveTab) {
        return
      }

      if (req?.status === "success") {
        // test if req.data as blob is json or not
        if (req.data.type === "application/json") {
          this.pdfStatus = JSON.parse(await req.data.text())?.status

          if (this.pdfStatus === "generating") {
            setTimeout(() => {
              if (this.activeTab === currentActiveTab) this.getPdf()
            }, 5000)
          }
        } else if (req.data.type === "application/pdf") {
          this.blobUrl = URL.createObjectURL(req.data)
          this.pdfStatus = "displayed"
        } else {
          this.pdfStatus = "error"
        }
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
    ErrorView,
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
  },
}
</script>
