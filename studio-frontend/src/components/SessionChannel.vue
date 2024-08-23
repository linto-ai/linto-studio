<template>
  <div class="flex col flex1 reset-overflows">
    <div
      v-if="hasText"
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
      <div ref="bottom"></div>
    </div>

    <!-- Subtitles -->
    <SessionSubtitle v-if="displaySubtitles" class="session-content__subtitle" :partialText="partialText" :finalText="finalText"/>
    
    
    <!-- <div
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
    </div> -->

    <button
      v-if="!isBottom"
      @click="scrollToBottom(true)"
      class="bottom-session-button"
      :class="{ has_subtitles: displaySubtitles }">
      <span class="icon bottom-arrow"></span>
    </button>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import {
  apiGetSessionChannel,
  apiGetPublicSessionChannel,
} from "@/api/session.js"

import SessionChannelTurn from "@/components/SessionChannelTurn.vue"
import SessionChannelTurnPartial from "@/components/SessionChannelTurnPartial.vue"
import Svglogo from "@/svg/Microphone.vue"
import SessionSubtitle from "@/components/SessionSubtitle.vue"
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
      default: "40",
    },
    displaySubtitles: {
      type: Boolean,
      default: true,
    },
    displayLiveTranscription: {
      type: Boolean,
      default: true,
    },
    organizationId: {
      type: String,
      required: false,
    },
    sessionId: {
      type: String,
      required: true,
    },
    isBottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    console.log("channel", this.channel)
    return {
      turns: [],
      previousTurns: [],
      partialText: "",
      finalText: {text:""},
    }
  },
  mounted() {
    this.previousTurns = this.channel?.closed_captions || []
    this.init()
  },
  computed: {
    channelIndex() {
      return this.channel.index
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
    hasText() {
      return (
        this.turns.length > 0 ||
        this.previousTurns.length > 0 ||
        this.partialText !== ""
      )
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
    displaySubtitles() {
      this.scrollToBottom()
    },
  },
  methods: {
    init() {
      this.partialText = ""
      this.turns = []
      this.sessionWS.subscribe(
        this.sessionId,
        this.channelIndex,
        this.onPartial.bind(this),
        this.onFinal.bind(this)
      )
      this.scrollToBottom()
    },
    async loadPreviousTranscrition() {
      let sessionRequest = null

      if (this.organizationId) {
        sessionRequest = await apiGetSessionChannel(
          this.organizationId,
          this.sessionId,
          this.channel.transcriber_id
        )
      }

      if (!sessionRequest || sessionRequest.status === "error") {
        sessionRequest = await apiGetPublicSessionChannel(
          this.sessionId,
          this.channel.transcriber_id
        )
      }

      const res = sessionRequest?.data?.channels?.[0] ?? {}
      this.previousTurns = res.closed_captions || []
    },
    onPartial(content) {
      this.partialText = content ?? ""
      this.scrollToBottom()
    },
    onFinal(content) {
      this.partialText = ""
      this.finalText = content
      this.turns.push(content)
      this.scrollToBottom()
    },
    scrollToBottom(force = false) {
      if (!this.displayLiveTranscription) return
      if (!this.hasText) return
      if (!this.isBottom && !force) return

      this.$nextTick().then(() => this.$refs.bottom.scrollIntoView())
    },
  },
  components: {
    Fragment,
    SessionChannelTurn,
    SessionChannelTurnPartial,
    Svglogo,
    SessionSubtitle,
  },
}
</script>
