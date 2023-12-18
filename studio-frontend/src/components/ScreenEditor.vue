<template>
  <div class="flex gap-small" id="screen-editor">
    <div class="flex1">
      <div v-if="prev" @click="seekTo(prev.stime)">
        <div class="form-label">Previous screen</div>
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
        <div class="form-label">Current screen</div>
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
        <div class="form-label">Next screen</div>
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
    let selected = this.screens.get(this.screens.first)
    return {
      selectedScreen: selected.screen,
      prev: null,
      next: this.screens.get(selected.next)?.screen,
    }
  },
  methods: {
    handleScreenEnter(screen_id) {
      let selected = this.screens.get(screen_id)
      this.selectedScreen = selected.screen
      this.prev = this.screens.get(selected.prev)?.screen
      this.next = this.screens.get(selected.next)?.screen
    },
    seekTo(stime) {
      bus.$emit("player_set_time", { stime })
    },
    addScreens(leftScreenId, rightScreenId) {
      console.log(
        "adding a new screen between " + leftScreenId + " and " + rightScreenId
      )
    },
    mergeScreens(leftScreenId, rightScreenId) {
      console.log("merging screens " + leftScreenId + " and " + rightScreenId)
    },
  },
  components: {
    ScreenActions,
  },
}
</script>
