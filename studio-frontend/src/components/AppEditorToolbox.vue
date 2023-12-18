<template>
  <div id="conversation-toolbox" :class="['flex', 'row']">
    <button
      class="toolbox-btn-play toolbox-btn"
      @click="playFromWord($event)"></button>
    <button class="toolbox-btn toolbox-btn-close" @click="close()"></button>
  </div>
</template>
<script>
import { bus } from "../main.js"

export default {
  props: {
    turnId: {
      type: String,
      required: true,
    },
    stime: {
      type: Number,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit("close")
      window.getSelection().removeAllRanges()
    },
    playFromWord(e) {
      e.preventDefault()
      e.stopPropagation()
      bus.$emit("play-from-word", { stime: this.stime })
      this.close()
    },
  },
}
</script>
