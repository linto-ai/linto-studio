<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="dataLoaded"
    :error="error"
    :sidebar="true">
    <template v-slot:sidebar>
      <div style="margin: 0 1rem">
        <h2>{{ $t("publish.filter_title.verbatim") }}</h2>
        <section>
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
        </section>
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
          aria-label="select how to open the conversation"
          :options="{
            actions: [
              { value: 'docx', text: $t('conversation.export.docx') },
              { value: 'txt', text: $t('conversation.export.txt') },
              { value: 'json', text: $t('conversation.export.json') },
            ],
          }"
          buttonClass="green"
          @input="exportConv"></CustomSelect>
      </div>
    </template>

    <div class="publish-turn-list-container flex col" v-if="dataLoaded">
      <Tabs
        v-model="activeTab"
        :tabs="[
          {
            name: 'verbatim',
            label: $t('publish.tabs.verbatim'),
            icon: 'text',
          },
          {
            name: 'summary',
            label: $t('publish.tabs.automatic_summary'),
            icon: 'text',
            disabled: true,
          },
        ]"></Tabs>
      <div class="publish-turn-list">
        <!-- <AppEditor
        :conversation="conversation"
        :usersConnected="usersConnected"
        :conversationUsers="conversationUsers"
        :userInfo="userInfo"
        :filterSpeakers="filterSpeakers"
        :turnPages="turnPages"
        :turns="turns"
        :canEdit="false"
        :noPlayer="true"
        :hightlightsCategories="[]"
        :hightlightsCategoriesVisibility="{}"
        ref="editor"
        v-if="status === 'done'"></AppEditor> -->
        <h1>{{ conversation.name }}</h1>
        <h2>Transcription</h2>
        <PublishTurn
          v-for="turn of turns"
          :turn="turn"
          :speakerIndexedBySpeakerId="speakerIndexedBySpeakerId" />
      </div>
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
} from "../api/conversation.js"

import Loading from "@/components/Loading.vue"
import Modal from "@/components/Modal.vue"
import UserInfoInline from "@/components/UserInfoInline.vue"
import AppEditor from "@/components/AppEditor.vue"
import ErrorView from "./Error.vue"
import MainContentConversation from "../components/MainContentConversation.vue"
import MenuToolbox from "../components/MenuToolbox.vue"
import CustomSelect from "../components/CustomSelect.vue"
import SwitchInput from "@/components/SwitchInput.vue"
import PublishTurn from "../components/PublishTurn.vue"
import Tabs from "../components/Tabs.vue"

export default {
  mixins: [conversationMixin],
  data() {
    return {
      conversationId: "",
      filterSpeakers: [],
      speakerIndexedBySpeakerId: {},
      helperVisible: false,
      status: null,
      filterTags: [],
      activeTab: "verbatim",
    }
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
  },
  computed: {
    dataLoaded() {
      return this.conversationLoaded
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    exportFileTitle() {
      return `${this.conversation.name.replace(/\s/g, "_")}_${moment().format(
        "YYYYMMDDHHmmss"
      )}`
    },
    turns() {
      if (!this.conversation) return []
      return this.conversation.text.filter((turn) => {
        if (turn.words.length > 0) {
          // filter by speakers
          if (
            this.filterSpeakers.length == 0 ||
            this.filterSpeakers.indexOf(turn.speaker_id) > -1
          ) {
            // filter by keywords
            if (
              this.filterTags.length == 0 ||
              this.filterTags.some((keyword) =>
                turn.segment.toLowerCase().includes(keyword)
              )
            )
              return true
          }
        }

        return false
      })
    },
    turnPages() {
      if (!this.turns) return []
      return [[...this.turns]]
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
      let req = await apiGetDocxFileFromConversation(
        this.conversationId,
        this.filterSpeakers,
        this.filterTags
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
  },
}
</script>
