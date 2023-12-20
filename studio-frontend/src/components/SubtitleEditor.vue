<template>
  <div class="flex1 flex col">
    <div class="flex1 flex subtitles" id="conversation">
      <VideoPlayer
        @videoLoaded="setVideo"
        :audioDuration="audio.duration"
        :screens="blocks.screens"></VideoPlayer>
      <div id="screen-list" class="flex1" :key="blockKey">
        <div v-for="block in blocks" :key="block.screen.screen_id">
          <SubtitleEditorBlock
            :userInfo="userInfo"
            :canEdit="canEdit"
            :block="block"></SubtitleEditorBlock>
        </div>
      </div>
    </div>
    <ScreenEditor
      :screens="blocks"
      :can-edit="canEdit"
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
  },
  data() {
    return {
      blockKey: 0,
      useVideo: null,
      playerKey: true,
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
      this.$emit("screenUpdate", screen_id, stime, etime)
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
        screen.classList.add("playing")
        screen.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        })
      }
    },
    handleScreenLeave(screenId) {
      let screen = document.getElementById(screenId)
      if (screen) {
        screen.classList.remove("playing")
      }
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
