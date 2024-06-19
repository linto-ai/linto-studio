<template>
  <div>
    <div
      class="flex col flex1 session-content__turns"
      :class="{ has_subtitles: displaySubtitles }">
      <SessionChannelTurn
        v-if="displayLiveTranscription"
        v-for="turn in turns"
        :key="turn.id"
        :turn="turn"></SessionChannelTurn>

      <SessionChannelTurnPartial
        v-if="displayLiveTranscription && partialText !== ''"
        ref="partial"
        :partialText="partialText"></SessionChannelTurnPartial>

      <div ref="bottom"></div>
    </div>
    <div
      class="session-content__subtitle"
      ref="subtitle"
      v-if="displaySubtitles">
      <div id="scroller">
        <div v-for="turn of lastTwoTurns">
          {{ turn.text }}
        </div>
        <div>{{ partialText }}</div>
        <div ref="subtitle-bottom"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import SessionChannelTurn from "@/components/SessionChannelTurn.vue"
import SessionChannelTurnPartial from "@/components/SessionChannelTurnPartial.vue"

export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
    sessionWS: {
      type: Object,
      required: true,
    },
    fontSize: {
      type: String,
      default: "16",
    },
    displaySubtitles: {
      type: Boolean,
      default: true,
    },
    displayLiveTranscription: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      turns: [],
      partialText: "",
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    selectedChannelId() {
      return this.channel?.transcriber_id
    },
    lastTwoTurns() {
      return this.turns.slice(-2)
    },
  },
  watch: {
    channel: {
      handler() {
        this.init()
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.turns = this.channel?.closed_captions || []
      this.sessionWS.subscribe(
        this.selectedChannelId,
        this.onPartial.bind(this),
        this.onFinal.bind(this)
      )
    },
    onPartial(content) {
      this.partialText = content ?? ""
      this.scrollToBottom()
      this.scrollSubtitle()
    },
    onFinal(content) {
      this.partialText = ""
      this.turns.push(content)
      this.scrollToBottom()
      this.scrollSubtitle()
    },
    scrollToBottom() {
      if (!this.displayLiveTranscription) return

      this.$nextTick().then(() => this.$refs.bottom.scrollIntoView())
    },
    scrollSubtitle() {
      if (!this.displaySubtitles) return

      this.$nextTick().then(() =>
        document
          .getElementById("scroller")
          .scroll(0, document.getElementById("scroller").scrollHeight)
      )
    },
  },
  components: { Fragment, SessionChannelTurn, SessionChannelTurnPartial },
}
</script>
