<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="conversationLoaded"
    :error="error">
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
      <div class="flex gap-small">
        <CustomSelect
          v-if="conversationLoaded"
          :value="subtitleId"
          :valueText="versionName"
          :options="versionList"
          @input="loadNewSubtitles"></CustomSelect>
        <!-- <button class="btn green" @click="downloadSrt" v-if="screens"> -->
        <!--   <span class="icon upload"></span> -->
        <!--   <span class="label">{{ $t("conversation.export.title") }}</span> -->
        <!-- </button> -->
        <CustomSelect
          :valueText="$t('conversation.export.title')"
          iconType="icon"
          icon="upload"
          value=""
          aria-label="select how to download the subtitles"
          :options="{
            actions: [
              { value: 'srt', text: $t('conversation.export.srt') },
              { value: 'vtt', text: $t('conversation.export.vtt') },
            ],
          }"
          buttonClass="green"
          @input="downloadSubtitles"></CustomSelect>
      </div>
    </template>
    <SubtitleEditor
      v-if="screens"
      :conversation="conversation"
      :userInfo="userInfo"
      :blocks="screens"
      :canEdit="userRights.hasRightAccess(userRight, userRights.WRITE)"
      @screenUpdate="screenUpdate">
    </SubtitleEditor>
  </MainContentConversation>
</template>
<script>
import { subtitleMixin } from "@/mixins/subtitle.js"
import { workerSendMessage } from "../tools/worker-message.js"
import { apiGetFileFromConversationSubtitle } from "../api/conversation.js"
import MainContentConversation from "../components/MainContentConversation.vue"
import SubtitleEditor from "@/components/SubtitleEditor.vue"
import CustomSelect from "@/components/CustomSelect.vue"
export default {
  mixins: [subtitleMixin],
  data() {
    return {
      status: null,
      subtitleVersions: [],
      subtitleId: this.$route.params.subtitleId,
    }
  },
  watch: {
    conversationLoaded(newVal, oldVal) {
      if (newVal) {
        this.subtitleVersions = this.conversation?.subtitleVersions || []
        let versionsIds = this.subtitleVersions.map((version) => version._id)
        if (!versionsIds.includes(this.subtitleId)) {
          this.$router.push({
            name: "conversations subtitles",
            params: { conversationId: this.conversationId },
          })
        } else {
          this.status = this.computeStatus(
            this.conversation?.jobs?.transcription
          )
          workerSendMessage("get_subtitle", { subtitleId: this.subtitleId })
        }
      }
    },
  },
  computed: {
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    subtitleAvailable() {
      return (
        this.conversationLoaded &&
        this.conversation.subtitleVersions.length != 0
      )
    },
    versionName() {
      return this.subtitleVersions.find((elem) => elem._id === this.subtitleId)
        ?.version
    },
    versionList() {
      let action = []
      for (const version of this.subtitleVersions) {
        action.push({
          value: version._id,
          text: version.version,
        })
      }
      return {
        action: action,
      }
    },
    versionList() {
      let action = []
      for (const version of this.subtitleVersions) {
        action.push({
          value: version._id,
          text: version.version,
        })
      }
      return {
        action: action,
      }
    },
  },
  methods: {
    async downloadSubtitles(type) {
      let req = await apiGetFileFromConversationSubtitle(
        this.conversation._id,
        this.subtitleId,
        type
      )

      if (req?.status === "success") {
        const file = URL.createObjectURL(
          new Blob([req?.data], { type: "text/plain" })
        )
        const link = document.createElement("a")
        link.href = file
        let filename = this.conversation.metadata.audio.filename
        filename = filename.split(".").slice(0, -1).join(".")
        link.download = `${filename} - ${this.subtitleObj.version}.${type}`
        link.click()
      }
    },
    screenUpdate(screen_id, stime, etime) {
      let block = this.screens?.screens.get(screen_id)
      if (block) {
        block.screen.stime = stime
        block.screen.etime = etime
        this.screens.screens.set(screen_id, block)
        workerSendMessage("update_screen", {
          screen: block.screen,
        })
      }
    },

    loadNewSubtitles(id) {
      if (id !== this.subtitleId) {
        this.$router.push({
          name: "conversations subtitle",
          params: {
            conversationId: this.conversation._id,
            subtitleId: id,
          },
        })
      }
    },
  },
  components: {
    MainContentConversation,
    SubtitleEditor,
    CustomSelect,
  },
}
</script>
