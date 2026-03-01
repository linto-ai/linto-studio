<template>
  <MainContentConversation
    :conversation="conversation"
    :breadcrumbItems="breadcrumbItems"
    :status="status"
    :dataLoaded="conversationLoaded"
    :error="error">
    <template v-slot:breadcrumb-actions>
      <div class="flex gap-small" style="margin-left: auto">
        <PopoverList
          v-if="conversationLoaded"
          :items="versionList"
          :value="subtitleId"
          @input="loadNewSubtitles" />
        <PopoverList
          :items="exportItems"
          aria-label="select how to download the subtitles"
          @input="downloadSubtitles">
          <template #trigger>
            <Button
              icon="upload"
              variant="primary"
              size="sm"
              :label="$t('conversation.export.title')" />
          </template>
        </PopoverList>
      </div>
    </template>
    <SubtitleEditor
      v-if="screens"
      :conversation="conversation"
      :userInfo="userInfo"
      :blocks="screens"
      :canEdit="canEdit"
      :conversation-users="conversationUsers"
      :users-connected="usersConnected"
      :focusFields="focusFields"
      @deleteScreen="deleteScreen"
      @updateScreen="updateScreen"
      @mergeScreen="mergeScreen"
      @textUpdate="textUpdate"
      @addScreen="addScreen">
    </SubtitleEditor>
  </MainContentConversation>
</template>
<script>
import { bus } from "../main"

import { workerSendMessage } from "@/tools/worker-message.js"
import { apiGetFileFromConversationSubtitle } from "@/api/conversation.js"

import { subtitleMixin } from "@/mixins/subtitle.js"

import MainContentConversation from "@/components/MainContentConversation.vue"
import SubtitleEditor from "@/components/SubtitleEditor.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import Button from "@/components/atoms/Button.vue"
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
            this.conversation?.jobs?.transcription,
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
    versionSettings() {
      return this.subtitleObj.generate_settings
    },
    versionList() {
      return this.subtitleVersions.map((version) => ({
        value: version._id,
        text: version.version,
      }))
    },
    exportItems() {
      return [
        { value: "srt", text: this.$t("conversation.export.srt") },
        { value: "vtt", text: this.$t("conversation.export.vtt") },
      ]
    },
    breadcrumbItems() {
      return [
        {
          label: this.conversation?.name ?? "",
          // to: {
          //   name: "conversations overview",
          //   params: { conversationId: this.conversationId },
          // },
        },
        {
          label: this.$t("breadcrumb.subtitles"),
          to: {
            name: "conversations subtitles",
            params: { conversationId: this.conversationId },
          },
        },
        {
          label: this.versionName,
        },
      ]
    },
  },
  methods: {
    async downloadSubtitles(type) {
      let req = await apiGetFileFromConversationSubtitle(
        this.conversation._id,
        this.subtitleId,
        type,
      )

      if (req?.status === "success") {
        const file = URL.createObjectURL(
          new Blob([req?.data], { type: "text/plain" }),
        )
        const link = document.createElement("a")
        link.href = file
        let filename = this.conversation.metadata.audio.filename
        filename = filename.split(".").slice(0, -1).join(".")
        link.download = `${filename} - ${this.subtitleObj.version}.${type}`
        link.click()
      }
    },
    updateScreen(screen_id, stime, etime) {
      let block = this.screens?.get(screen_id)
      if (block) {
        block.screen.stime = stime
        block.screen.etime = etime
        this.screens.set(screen_id, block)
        workerSendMessage("update_screen", {
          screen: block.screen,
        })
      }
    },
    deleteScreen(screenId) {
      this.screens.delete(screenId)
      workerSendMessage("delete_screen", { screenId })
    },
    mergeScreen(keptScreenId, deletedScreenId) {
      let keptScreen = this.screens.get(keptScreenId)
      let deletedScreen = this.screens.get(deletedScreenId)
      let newLineNumber =
        keptScreen.screen.text.length + deletedScreen.screen.text.length
      if (newLineNumber > this.versionSettings.screenLines) {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "conversation.subtitles.error.too_much_lines_to_merge",
            { maxLines: this.versionSettings.screenLines },
          ),
          timout: null,
          redirect: false,
        })
      } else if (
        keptScreen.next === deletedScreenId ||
        keptScreen.prev === deletedScreenId
      ) {
        workerSendMessage("merge_screens", { keptScreenId, deletedScreenId })
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "conversation.subtitles.error.cannot_merge_non_consecutive_screens",
          ),
          timout: null,
          redirect: false,
        })
      }
    },
    addScreen(screen_id, after = true) {
      let stime, etime
      let currentScreen = this.screens.get(screen_id)
      let audio = this.conversation.metadata.audio
      if (after) {
        let next = this.screens.get(currentScreen.next)
        stime = currentScreen.screen.etime
        etime = next?.screen.stime || audio.duration + 0.01
      } else {
        let prev = this.screens.get(currentScreen.prev)
        stime = prev?.screen.etime || -0.01
        etime = currentScreen.screen.stime
      }
      stime += 0.01
      etime -= 0.01
      if (etime - stime < 0.1) {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.t(
            "conversation.subtitles.error.no_enough_place_new_screen",
          ),
          timout: null,
          redirect: false,
        })
      } else {
        let newScreen = {
          stime,
          etime,
          text: [],
          words: [],
          turn_id: currentScreen.screen.turn_id,
        }
        workerSendMessage("add_screen", { after, screen_id, newScreen })
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
    textUpdate(screenId, text) {
      let block = this.screens.get(screenId)
      if (block) {
        block.screen.text = text.split("\n").map((line) => line.trim())
        workerSendMessage("screen_edit_text", {
          screenId: screenId,
          newText: text,
        })
      }
    },
  },
  components: {
    MainContentConversation,
    SubtitleEditor,
    PopoverList,
    Button,
  },
}
</script>
