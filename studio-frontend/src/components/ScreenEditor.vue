<template>
  <div class="flex gap-small" id="screen-editor">
    <div class="flex1">
      <div v-if="prev" @click="seekTo(prev.stime)">
        <div class="form-label">
          {{ $t("conversation.subtitles.screens.previous_screen") }}
        </div>
        <div class="screen-preview">
          <p v-for="line of prev.text">
            {{ line }}
          </p>
        </div>
      </div>
    </div>
    <ScreenActions
      :left-screen-id="prev?.screen_id"
      :right-screen-id="selectedScreen.screen_id"
      :can-edit="canEdit"
      @add="addScreens"
      @merge="mergeScreens"></ScreenActions>
    <div class="flex1">
      <div>
        <div class="form-label" id="current-screen-label">
          {{ $t("conversation.subtitles.screens.current_screen") }}
        </div>
        <div class="screen-preview current">
          <p v-for="line of selectedScreen.text">
            {{ line }}
          </p>
        </div>
      </div>
    </div>
    <ScreenActions
      :left-screen-id="selectedScreen.screen_id"
      :right-screen-id="next?.screen_id"
      :can-edit="canEdit"
      @add="addScreens"
      @merge="mergeScreens"></ScreenActions>
    <div class="flex1">
      <div v-if="next" @click="seekTo(next.stime)">
        <div class="form-label">
          {{ $t("conversation.subtitles.screens.next_screen") }}
        </div>
        <div class="screen-preview">
          <p v-for="line of next.text">
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ScreenList } from "../models/screenList"
import { bus } from "../main.js"
import ScreenActions from "./ScreenActions.vue"

export default {
  props: {
    screens: {
      type: ScreenList,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  mounted() {
    bus.$on("screen-enter", this.handleScreenEnter)
  },
  beforeDestroy() {
    bus.$off("screen-enter", this.handleScreenEnter)
  },
  data() {
    return {
      currentScreen: this.screens.get(this.screens.first),
    }
  },
  computed: {
    selectedScreen() {
      return this.currentScreen.screen
    },
    prev() {
      return this.screens.get(this.currentScreen.prev)?.screen
    },
    next() {
      return this.screens.get(this.currentScreen.next)?.screen
    },
  },
  methods: {
    handleScreenEnter(screen_id) {
      this.currentScreen = this.screens.get(screen_id)
    },
    seekTo(stime) {
      bus.$emit("player_set_time", { stime })
    },
    addScreens(leftScreenId, rightScreenId) {
      this.$emit("addScreen", leftScreenId, rightScreenId)
    },
    mergeScreens(leftScreenId, rightScreenId) {
      if (leftScreenId === this.selectedScreen.screen_id) {
        this.$emit("mergeScreens", leftScreenId, rightScreenId)
      } else {
        this.$emit("mergeScreens", rightScreenId, leftScreenId)
      }
    },
  },
  components: {
    ScreenActions,
  },
}
</script>
