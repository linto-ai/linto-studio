<template>
  <div class="flex1 flex col">
    <div class="flex1 flex subtitles" id="conversation">
      <VideoPlayer
        @videoLoaded="setVideo"
        :audioDuration="audio.duration"
        :screens="blocks.screens"></VideoPlayer>
      <div id="screen-list" class="flex1" :key="blocks.size">
        <div v-for="block in blocks" :key="block.screen.screen_id">
          <SubtitleEditorBlock
            :userInfo="userInfo"
            :canEdit="canEdit"
            :block="block"
            @delete="deleteScreen(block.screen.screen_id)"
            :isSelected="
              block.screen.screen_id === playingScreenId
            "></SubtitleEditorBlock>
        </div>
      </div>
    </div>
    <div id="subtitle-editor">
      <ScreenEditor
        :user-info="userInfo"
        :screens="blocks"
        :can-edit="canEdit"
        :conversation-id="conversation._id"
        :conversation-users="conversationUsers"
        :focusFields="focusFields"
        :users-connected="usersConnected"
        :playingScreen="playingScreenId"
        @textUpdate="textUpdate"
        @mergeScreens="mergeScreens"
        @addScreen="addScreen"></ScreenEditor>
      <SubtitlePlayer
        :key="playerKey"
        :conversationId="conversation._id"
        :audio="audio"
        :blocks="blocks"
        :canEdit="canEdit"
        :useVideo="useVideo"
        @blockUpdate="blockUpdate"></SubtitlePlayer>
    </div>
  </div>
</template>
<script>
import { bus } from "../main.js"
import SubtitleEditorBlock from "./SubtitleEditorBlock.vue"
import SubtitlePlayer from "@/components/SubtitlePlayer.vue"
import VideoPlayer from "./VideoPlayer.vue"
import { ScreenList } from "../models/screenList.js"
import ScreenEditor from "./ScreenEditor.vue"

export default {
  props: {
    canEdit: {
      type: Boolean,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    conversation: {
      type: Object,
      required: true,
    },
    blocks: {
      type: ScreenList,
      required: true,
    },
    conversationUsers: {
      type: Array,
      required: true,
      default: () => [],
    },
    usersConnected: {
      type: Array,
      default: () => [],
    },
    focusFields: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      useVideo: null,
      playerKey: true,
      playingScreenId: this.blocks.first,
    }
  },
  computed: {
    audio() {
      return this.conversation.metadata.audio
    },
  },
  mounted() {
    bus.$on("screen-enter", this.handleScreenEnter)
    bus.$on("screen-leave", this.handleScreenLeave)
  },
  beforeDestroy() {
    bus.$off("screen-enter", this.handleScreenEnter)
    bus.$off("screen-leave", this.handleScreenLeave)
  },
  methods: {
    setVideo(video) {
      this.useVideo = video
      this.playerKey = !this.playerKey
    },
    blockUpdate(screen_id, stime, etime) {
      this.$emit("updateScreen", screen_id, stime, etime)
    },
    textUpdate(screenId, text) {
      this.$emit("textUpdate", screenId, text)
    },
    deleteScreen(screenId) {
      this.$emit("deleteScreen", screenId)
    },
    mergeScreens(keptScreenId, deletedScreenId) {
      this.$emit("mergeScreen", keptScreenId, deletedScreenId)
    },
    addScreen(leftScreenId, rightScreenId) {
      if (leftScreenId) {
        this.$emit("addScreen", leftScreenId)
      } else {
        this.$emit("addScreen", rightScreenId, false)
      }
    },
    handleScreenEnter(screenId) {
      let screen = document.getElementById(screenId)
      if (screen) {
        this.playingScreenId = screenId
        screen.classList.add("playing")
        screen.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        })
      }
    },
    handleScreenLeave(screenId) {
      // let screen = document.getElementById(screenId)
      // if (screen) {
      //   if (this.playingScreenId === screenId) {
      //     this.playingScreenId = null
      //   }
      //   screen.classList.remove("playing")
      // }
    },
  },
  components: {
    SubtitleEditorBlock,
    SubtitlePlayer,
    VideoPlayer,
    ScreenEditor,
  },
}
</script>
