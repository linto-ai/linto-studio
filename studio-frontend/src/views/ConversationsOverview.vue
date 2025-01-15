<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="dataLoaded"
    :error="error">
    <template v-slot:breadcrumb-actions v-if="conversation">
      <router-link :to="conversationListRoute" class="btn secondary">
        <span class="icon close"></span>
        <span class="label">{{ $t("conversation.close_overview") }}</span>
      </router-link>
      <h1
        class="flex1 center-text text-cut"
        style="padding-left: 1rem; padding-right: 1rem">
        {{ name }}
      </h1>
      <div class="flex row conversation-actions gap-small">
        <router-link
          :to="`/interface/conversations/${conversation._id}/transcription`"
          class="btn green"
          :is="status !== 'done' ? 'span' : 'router-link'"
          :disabled="status !== 'done'">
          <span class="icon conv-list"></span>
          <span class="label">{{
            $t("conversation.transcription_label")
          }}</span>
        </router-link>
      </div>
    </template>
    <div class="flex overview-container" v-if="conversation">
      <!-- LEFT COLUMN -->
      <div class="flex col flex1">
        <ConversationOverviewMainInfos
          :conversation="conversation"
          :rootConversation="rootConversation"
          :channels="channels"
          :canEdit="userRights.hasRightAccess(userRight, userRights.WRITE)" />
      </div>
      <!-- Media file -->
      <div class="flex col flex1">
        <section
          class="flex col overview__main-section"
          v-if="
            conversation.metadata.audio && conversation.metadata.audio.filename
          ">
          <h2 v-if="conversation.metadata.audio">
            {{ $t("conversation.media_label") }}
          </h2>

          <LabeledValue :label="$t('conversation.media.file_label_inline')">
            <button
              @click="downloadAudio"
              class="transparent"
              v-if="!loadingAudio">
              {{ fileName }}
            </button>
            <div v-else>{{ $t("conversation.loading_audio_file") }}</div>
          </LabeledValue>

          <LabeledValue
            :label="$t('conversation.media.duration_label_inline')"
            :value="duration"></LabeledValue>
        </section>
        <ConversationOverviewMetadata :conversation="conversation" />
      </div>
    </div>
  </MainContentConversation>
</template>
<script>
import { bus } from "../main.js"

import { getEnv } from "@/tools/getEnv"
import RIGHTS_LIST from "@/const/rigthsList.js"
import { conversationMixin } from "@/mixins/conversation.js"
import { debounceMixin } from "@/mixins/debounce.js"
import { timeToHMS } from "@/tools/timeToHMS"

import Loading from "@/components/Loading.vue"
import Modal from "@/components/Modal.vue"
import ConversationShare from "@/components/ConversationShare.vue"
import UserInfoInline from "@/components/UserInfoInline.vue"
import CollaborativeField from "@/components/CollaborativeField.vue"
import MainContentConversation from "@/components/MainContentConversation.vue"
import ConversationStatus from "@/components/ConversationStatus.vue"
import ConversationOverviewMainInfos from "@/components/ConversationOverviewMainInfos.vue"
import ConversationOverviewMetadata from "@/components/ConversationOverviewMetadata.vue"
import LabeledValue from "@/components/LabeledValue.vue"

export default {
  mixins: [conversationMixin, debounceMixin],
  data() {
    return {
      selfUrl: (convId) => `/interface/conversations/${convId}`,
      conversationId: "",
      membersRight: {
        value: 1,
        error: null,
        valid: true,
      },
      rigthsList: RIGHTS_LIST((key) => this.$i18n.t(key)),
      status: null,
      loadingAudio: false,
    }
  },
  mounted() {},
  watch: {
    dataLoaded(data) {
      if (data) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
      }
    },
  },
  computed: {
    dataLoaded() {
      return this.conversationLoaded
    },
    keywordExtractorStatus() {
      return this.conversation?.jobs?.keyword?.state || "none"
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    fileName() {
      return this.conversation?.metadata?.audio?.filename
    },
    duration() {
      return timeToHMS(this.conversation?.metadata?.audio?.duration)
    },
    linkToMedia() {
      const BASE_API = getEnv("VUE_APP_CONVO_API")
      return `${BASE_API}/conversations/${this.conversationId}/media`
    },
  },
  methods: {
    updateConversationName() {
      bus.$emit("update_conversation_name", {})
    },
    async downloadAudio() {
      this.loadingAudio = true
      await this.getAudioFile()
      const link = document.createElement("a")
      link.href = this.audioFile
      link.download = this.fileName + ".mp3"
      link.click()
      URL.revokeObjectURL(link.href)
      this.loadingAudio = false
    },
  },
  components: {
    ConversationShare,
    Modal,
    UserInfoInline,
    CollaborativeField,
    Loading,
    MainContentConversation,
    ConversationStatus,
    ConversationOverviewMainInfos,
    ConversationOverviewMetadata,
    LabeledValue,
  },
}
</script>
