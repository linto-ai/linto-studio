<template>
  <div class="flex col flex1 reset-overflows">
    <div
      v-if="turns.length > 0 || previousTurns.length > 0 || partialText !== ''"
      class="flex col flex1 session-content__turns reset-overflows"
      :class="{ has_subtitles: displaySubtitles }">
      <SessionChannelTurn
        v-if="displayLiveTranscription"
        v-for="turn in previousTurns"
        :key="turn.id"
        :turn="turn"></SessionChannelTurn>

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
      v-else
      class="flex align-center justify-center flex1 col center-text gap-medium">
      <h2>{{ $t("session.detail_page.no_transcription") }}</h2>
      <Svglogo style="max-height: 6rem; margin: 2rem" />
    </div>

    <div
      class="session-content__subtitle"
      :style="style"
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
import Svglogo from "@/svg/Microphone.vue"
import { apiGetSessionChannel } from "@/api/session.js"

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
      default: "48",
    },
    displaySubtitles: {
      type: Boolean,
      default: true,
    },
    displayLiveTranscription: {
      type: Boolean,
      default: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      turns: [],
      previousTurns: [],
      partialText: "",
    }
  },
  mounted() {
    this.previousTurns = this.channel?.closed_captions || []
    this.init()
  },
  computed: {
    selectedChannelId() {
      return this.channel?.transcriber_id
    },
    lastTwoTurns() {
      return this.turns.slice(-2)
    },
    style() {
      return {
        fontSize: this.fontSize + "px",
        lineHeight: this.fontSize * 1.3 + "px",
      }
    },
  },
  watch: {
    channel: {
      handler() {
        this.init()
        this.loadPreviousTranscrition()
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.partialText = ""
      this.turns = []
      this.sessionWS.subscribe(
        this.selectedChannelId,
        this.onPartial.bind(this),
        this.onFinal.bind(this)
      )
      this.scrollToBottom()
      this.scrollSubtitle()
    },
    async loadPreviousTranscrition() {
      console.log(this.channel)
      let res = await apiGetSessionChannel(
        this.currentOrganizationScope,
        this.sessionId,
        this.channel.transcriber_id
      )
      this.previousTurns = res.closed_captions
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
  components: {
    Fragment,
    SessionChannelTurn,
    SessionChannelTurnPartial,
    Svglogo,
  },
}
</script>
