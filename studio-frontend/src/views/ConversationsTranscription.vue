<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="dataLoaded"
    :error="error"
    sidebar>
    <template v-slot:sidebar>
      <KeywordList :conversation="conversation" />
    </template>

    <template v-slot:breadcrumb-actions>
      <router-link :to="conversationListRoute" class="btn">
        <span class="icon close"></span>
        <span class="label">{{ $t("conversation.close_editor") }}</span>
      </router-link>

      <h1
        class="flex1 center-text text-cut"
        style="padding-left: 1rem; padding-right: 1rem">
        {{ conversation.name }}
      </h1>

      <router-link
        :to="{
          name: 'conversations publish',
          params: { conversationId: conversation._id },
        }"
        class="btn green">
        <span class="icon document"></span>
        <span class="label">{{ $t("conversation.publish_document") }}</span>
      </router-link>
    </template>

    <div class="flex flex1">
      <AppEditor
        :conversation="conversation"
        :usersConnected="usersConnected"
        :conversationUsers="conversationUsers"
        :userInfo="userInfo"
        :filterSpeakers="filterSpeakers"
        :turnPages="turnPages"
        :turns="turns"
        :canEdit="userRights.hasRightAccess(userRight, userRights.WRITE)"
        ref="editor"
        v-if="status === 'done'"></AppEditor>
    </div>
  </MainContentConversation>
</template>
<script>
import ConversationShare from "@/components/ConversationShare.vue"
import TranscriptionHelper from "@/components/TranscriptionHelper.vue"
import moment from "moment"
import { conversationMixin } from "../mixins/conversation.js"

import Loading from "@/components/Loading.vue"
import Modal from "@/components/Modal.vue"
import UserInfoInline from "@/components/UserInfoInline.vue"
import AppEditor from "@/components/AppEditor.vue"
import ErrorView from "./Error.vue"
import MainContentConversation from "../components/MainContentConversation.vue"
import KeywordList from "../components/KeywordList.vue"
import MenuToolbox from "../components/MenuToolbox.vue"

export default {
  mixins: [conversationMixin],
  data() {
    return {
      conversationId: "",
      filterSpeakers: "default",
      helperVisible: false,
      status: null,
    }
  },
  watch: {
    "conversation.speakers"(newVal, oldVal) {
      if (
        this.filterSpeakers != "default" &&
        newVal.filter((spk) => spk.speaker_id == this.filterSpeakers).length ==
          0
      ) {
        this.filterSpeakers = "default"
      }
    },
    dataLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
        // if (this.status !== "done") {
        //   this.$router.push(`/interface/conversations/${this.conversation._id}`)
        // }
      }
    },
  },
  computed: {
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    dataLoaded() {
      return this.conversationLoaded
    },
    exportFileTitle() {
      return `${this.conversation.name.replace(/\s/g, "_")}_${moment().format(
        "YYYYMMDDHHmmss"
      )}`
    },
    turns() {
      if (!this.conversation) return []
      if (this.filterSpeakers && this.filterSpeakers != "default") {
        const filterTurns = this.conversation.text.filter(
          (turn) => turn.speaker_id == this.filterSpeakers
        )
        return filterTurns
      } else {
        return this.conversation.text.filter((turn) => turn.words.length > 0)
      }
    },
    turnPages() {
      if (!this.turns) return []
      let res = [[]]
      let currentPage = 0
      let nbCaracters = 0
      let nbTurns = 0
      res[currentPage] = []
      this.turns.forEach((turn, index) => {
        res[currentPage].push(turn)
        nbCaracters += turn.segment.length
        if (nbCaracters > parseInt(process.env.VUE_APP_TURN_SIZE) * 2) {
          nbCaracters = 0
          nbTurns = 0
          currentPage += 1
          res[currentPage] = []
        }
        nbTurns += 1
        if (nbTurns > parseInt(process.env.VUE_APP_TURN_PER_PAGE)) {
          nbTurns = 0
          nbCaracters = 0
          currentPage += 1
          res[currentPage] = []
        }
      })
      if (res[res.length - 1].length === 0) {
        res.pop()
      }
      return res
    },
  },
  methods: {
    showHelper() {
      this.helperVisible = true
    },
    closeHelper() {
      this.helperVisible = false
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
    KeywordList,
    MenuToolbox,
  },
}
</script>