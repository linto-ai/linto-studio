<template>
  <Loading v-if="loading" />
  <div class="flex col flex1 reset-overflows" v-else>
    <!-- copy bar-->
    <div
      class="session-content__action-bar flex align-center gap-medium"
      v-if="this.selectedTurns.length > 0">
      <button
        class="tertiary outline session-content__action-bar__reset-btn-desktop"
        @click="clearSelectedTurns">
        <span class="icon close"></span>
        <span class="label">{{
          $tc("session.detail_page.clear_turn_selection")
        }}</span>
      </button>

      <button
        class="tertiary outline session-content__action-bar__reset-btn-mobile mobile only-icon"
        @click="clearSelectedTurns">
        <span class="icon close"></span>
      </button>

      <button
        @click="copyTurns"
        class="session-content__action-bar__copy-btn-desktop">
        <span class="icon apply" v-if="copyState"></span>
        <span class="icon copy" v-else></span>
        <span class="label">{{
          $tc("session.detail_page.copy_turns_text")
        }}</span>
      </button>

      <span
        class="session-content__action-bar__label-selected flex1 text-cut"
        >{{
          $tc("session.detail_page.n_turns_selected", this.selectedTurns.length)
        }}</span
      >

      <button
        @click="copyTurns"
        class="session-content__action-bar__copy-btn-mobile mobile only-icon">
        <span class="icon apply" v-if="copyState"></span>
        <span class="icon copy" v-else></span>
      </button>
    </div>

    <!-- content if live transcript is disabled -->

    <div
      v-if="!liveTranscript"
      class="flex align-center justify-center flex1 col center-text">
      <h2>{{ $t("session.detail_page.live_transcript_disabled.title") }}</h2>
      <p>
        {{ $t("session.detail_page.live_transcript_disabled.description") }}
      </p>
      <div class="flex gap-medium" v-if="fromMicrophone">
        <Button
          v-if="isRecording"
          @click="toggleMicrophone"
          :title="$t('quick_session.live.pause_button')"
          :aria-label="$t('quick_session.live.pause_button')"
          icon="pause"></Button>
        <!-- <div
          class="btn circle only-icon primary"
          @click="toggleMicrophone"
          :title="$t('quick_session.live.pause_button')"
          :aria-label="$t('quick_session.live.pause_button')"
          v-if="isRecording">
          <span class="icon pause"></span>
        </div> -->
        <Button
          v-else
          @click="toggleMicrophone"
          :title="$t('quick_session.live.start_button')"
          :aria-label="$t('quick_session.live.start_button')"
          icon="play"></Button>
        <!-- <div
          class="btn circle only-icon"
          @click="toggleMicrophone"
          :title="$t('quick_session.live.start_button')"
          :aria-label="$t('quick_session.live.start_button')"
          v-else>
          <span class="icon play"></span>
        </div> -->
        <Button
          @click="onSave"
          :title="$t('quick_session.live.save_button')"
          :aria-label="$t('quick_session.live.save_button')"
          icon="stop"></Button>
        <!-- <div
          class="btn circle only-icon red"
          @click="onSave"
          :title="$t('quick_session.live.save_button')"
          :aria-label="$t('quick_session.live.save_button')">
          <span class="icon stop"></span>
        </div> -->
      </div>
    </div>

    <!-- content live -->

    <div
      v-else-if="hasText"
      class="flex col flex1 session-content__turns reset-overflows"
      :class="{ has_subtitles: displaySubtitles }">
      <SessionChannelTurn
        v-for="(turn, turnIndex) in previousTurns"
        v-if="displayLiveTranscription && shouldDisplayTurn(turn)"
        :key="turn.uuid"
        :channelLanguages="channelLanguages"
        :selectedTranslations="selectedTranslations"
        :previous="turnIndex > 0 ? previousTurns[turnIndex - 1] : null"
        :turn="turn"
        :selected="selectedTurns.includes(turn.uuid)"
        @select="onSelectTurn(turn.uuid, $event)"></SessionChannelTurn>

      <SessionChannelTurn
        v-for="(turn, turnIndex) in turns"
        v-if="displayLiveTranscription && shouldDisplayTurn(turn)"
        :key="turn.uuid"
        :channelLanguages="channelLanguages"
        :selectedTranslations="selectedTranslations"
        :previous="turnIndex > 0 ? turns[turnIndex - 1] : lastOfPreviousTurns"
        :turn="turn"
        :selected="selectedTurns.includes(turn.uuid)"
        @select="onSelectTurn(turn.uuid, $event)"></SessionChannelTurn>

      <SessionChannelTurnPartial
        v-if="displayLiveTranscription && partialText !== ''"
        ref="partial"
        :previous="lastTurn || lastOfPreviousTurns"
        :channelLanguages="channelLanguages"
        :selectedTranslations="selectedTranslations"
        :partialObject="partialObject"
        :partialText="partialText"></SessionChannelTurnPartial>

      <div ref="bottom"></div>
    </div>
    <div
      v-else
      class="flex align-center justify-center flex1 col center-text gap-medium">
      <h2>{{ $t("session.detail_page.no_transcription") }}</h2>
      <Svglogo style="max-height: 6rem; margin: 2rem; max-width: 100%" />
      <div ref="bottom"></div>
    </div>

    <!-- Subtitles -->
    <SessionSubtitle
      v-if="displaySubtitles && !isMobile"
      :previousTurns="previousTurns"
      :partialText="partialText"
      :finalText="finalText"
      :fontSize="fontSize"
      :key="fontSize"
      :watermarkFrequency="watermarkFrequency"
      :watermarkDuration="watermarkDuration"
      :watermarkContent="watermarkContent"
      :watermarkPinned="watermarkPinned"
      :displayWatermark="displayWatermark" />
    <SubtitleFullscreen
      v-if="showSubtitlesFullscreen && isMobile"
      :partialText="partialText"
      :finalText="finalText"
      :watermarkFrequency="watermarkFrequency"
      :watermarkDuration="watermarkDuration"
      :watermarkContent="watermarkContent"
      :watermarkPinned="watermarkPinned"
      :displayWatermark="displayWatermark"
      @close="closeSubtitleFullscreen" />
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
      class="bottom-session-button bottom-session-button-desktop outline"
      :class="{ has_subtitles: displaySubtitles }">
      <span class="icon bottom-arrow"></span>
      <span class="label">{{
        $tc("session.detail_page.scroll_to_bottom")
      }}</span>
    </button>

    <button
      v-if="!isBottom"
      @click="scrollToBottom(true)"
      class="mobile bottom-session-button bottom-session-button-mobile only-icon green circle"
      :class="{ has_subtitles: displaySubtitles }">
      <span class="icon bottom-arrow"></span>
    </button>
  </div>
</template>
<script>
import uuidv4 from "uuid/v4.js"

import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"

import { sessionChannelModelMixin } from "@/mixins/sessionChannelModel.js"
import getTextTurnWithTranslation from "@/tools/getTextTurnWithTranslation.js"

import {
  apiGetSessionChannel,
  apiGetPublicSessionChannel,
} from "@/api/session.js"

import SessionChannelTurn from "@/components/SessionChannelTurn.vue"
import SessionChannelTurnPartial from "@/components/SessionChannelTurnPartial.vue"
import Svglogo from "@/svg/Microphone.vue"
import SessionSubtitle from "@/components/SessionSubtitle.vue"
import Loading from "@/components/atoms/Loading.vue"
import SubtitleFullscreen from "@/components-mobile/SubtitleFullscreen.vue"

export default {
  mixins: [sessionChannelModelMixin],
  props: {
    channel: {
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
    selectedTranslations: {
      type: String,
      required: false,
      default: "original",
    },
    showSubtitlesFullscreen: {
      type: Boolean,
      default: false,
    },
    isRecording: {
      type: Boolean,
      required: false,
      default: false,
    },
    fromMicrophone: {
      type: Boolean,
      required: false,
      default: false,
    },
    watermarkFrequency: {
      type: Number,
      required: true,
    },
    watermarkDuration: {
      type: Number,
      required: true,
    },
    watermarkContent: {
      type: String,
      required: true,
    },
    watermarkPinned: {
      type: Boolean,
      required: true,
    },
    displayWatermark: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      turns: [],
      previousTurns: [],
      partialText: "",
      partialObject: {},
      finalText: "",
      finalObject: {},
      loading: true,
      selectedTurns: [],
      copyState: false,
    }
  },
  mounted() {
    // add uuid to the channel
    // this.previousTurns = (this.channel?.closedCaptions || []).map((turn) => {
    //   return {
    //     ...turn,
    //     uuid: uuidv4(),
    //   }
    // })

    document.addEventListener("keydown", this.keydown)
  },
  beforeDestroy() {
    this.$apiEventWS.unSubscribeSessionRoom()
    document.removeEventListener("keydown", this.keydown)
  },
  computed: {
    channelIndex() {
      return this.channelId
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
    isMobile() {
      // test mediaquery
      return window.matchMedia("(max-width: 1100px)").matches
    },
    lastTurn() {
      return this.turns.slice(-1)[0]
    },
    lastOfPreviousTurns() {
      return this.previousTurns.slice(-1)[0]
    },
  },
  watch: {
    channel: {
      async handler() {
        this.loading = true
        this.init()
        await this.loadPreviousTranscrition()
        this.loading = false
        this.scrollToBottom()
        this.clearSelectedTurns()
      },
      deep: true,
      immediate: true,
    },
    displaySubtitles() {
      this.scrollToBottom(true)
    },
    "$apiEventWS.state.isConnected"(newValue, oldValue) {
      if (newValue) {
        this.subscribeToWebsocket()
      }
    },
  },
  methods: {
    init() {
      this.partialText = ""
      this.turns = []
      if (this.$apiEventWS.state.isConnected) {
        this.subscribeToWebsocket()
      }
      setTimeout(() => {
        this.scrollToBottom(true)
      }, 1000)
    },
    subscribeToWebsocket() {
      this.$apiEventWS.subscribeSessionRoom(
        this.sessionId,
        this.channelIndex,
        this.onPartial.bind(this),
        this.onFinal.bind(this),
      )
    },
    shouldDisplayTurn(turn) {
      const hasSpeaker = !!turn.locutor
      if (
        this.hasDiarization &&
        this.selectedTranslations === "original" &&
        hasSpeaker
      ) {
        return true
      }

      if (this.selectedTranslations !== "original" && !hasSpeaker) {
        return true
      }

      if (!this.hasDiarization && !hasSpeaker) {
        return true
      }

      return false
    },
    async loadPreviousTranscrition() {
      let sessionRequest = null

      if (this.organizationId) {
        sessionRequest = await apiGetSessionChannel(
          this.organizationId,
          this.sessionId,
          this.channelIndex,
        )
      }

      if (!sessionRequest || sessionRequest.status === "error") {
        sessionRequest = await apiGetPublicSessionChannel(
          this.sessionId,
          this.channel.transcriber_id,
        )
      }

      // filter out the channel we are interested in

      const allChannels = sessionRequest?.data?.channels

      if (!allChannels) {
        this.previousTurns = []
      } else {
        const channel = allChannels.find(
          (channel) => channel.id === this.channelIndex,
        )
        // add uuid to the channel
        this.previousTurns = (channel?.closedCaptions || []).map((turn) => {
          return {
            ...turn,
            uuid: uuidv4(),
          }
        })
      }
    },
    onPartial(content) {
      this.partialText = getTextTurnWithTranslation(
        content,
        this.selectedTranslations,
        this.channelLanguages,
      )
      this.partialObject = content
      this.scrollToBottom()
    },
    onFinal(content) {
      content.uuid = uuidv4()

      this.partialText = ""

      this.finalText = getTextTurnWithTranslation(
        content,
        this.selectedTranslations,
        this.channelLanguages,
      )
      this.finalObject = content
      this.turns.push(content)
      this.scrollToBottom()
    },
    scrollToBottom(force = false) {
      if (!this.displayLiveTranscription) return
      if (!this.hasText) return
      if (!this.isBottom && !force) return

      this.$nextTick().then(() => {
        if (this.$refs.bottom) {
          this.$refs.bottom.scrollIntoView({ behavior: "smooth" })
        }
      })
    },
    clearSelection() {
      if (document.selection && document.selection.empty) {
        document.selection.empty()
      } else if (window.getSelection) {
        var sel = window.getSelection()
        sel.removeAllRanges()
      }
    },
    onSelectTurn(turnId, event) {
      event.stopPropagation()
      event.preventDefault()
      if (event.ctrlKey) {
        if (this.selectedTurns.includes(turnId)) {
          this.selectedTurns = this.selectedTurns.filter((id) => id !== turnId)
        } else {
          this.selectedTurns.push(turnId)
        }

        return
      }

      if (event.shiftKey) {
        this.clearSelection()
        const allturns = this.previousTurns.concat(this.turns)
        const clickedIndex = allturns.findIndex((turn) => turn.uuid === turnId)
        const firstSelectedIndex = allturns.findIndex(
          (turn) => turn.uuid === this.selectedTurns[0],
        )
        const lastSelectedIndex = allturns.findIndex(
          (turn) =>
            turn.uuid === this.selectedTurns[this.selectedTurns.length - 1],
        )

        if (clickedIndex < firstSelectedIndex) {
          this.selectedTurns = allturns
            .slice(clickedIndex, firstSelectedIndex + 1)
            .map((turn) => turn.uuid)
        }

        if (clickedIndex > lastSelectedIndex) {
          this.selectedTurns = allturns
            .slice(lastSelectedIndex, clickedIndex + 1)
            .map((turn) => turn.uuid)
        }

        return
      }

      if (
        this.selectedTurns.includes(turnId) &&
        this.selectedTurns.length === 1
      ) {
        this.selectedTurns = this.selectedTurns.filter((id) => id !== turnId)
      } else {
        this.selectedTurns = [turnId]
      }
    },
    copyTurns() {
      const selectedTurns = this.turns.filter((turn) =>
        this.selectedTurns.includes(turn.uuid),
      )
      const previousSelectedTurns = this.previousTurns.filter((turn) =>
        this.selectedTurns.includes(turn.uuid),
      )

      const text = previousSelectedTurns
        .concat(selectedTurns)
        .map((turn) =>
          getTextTurnWithTranslation(
            turn,
            this.selectedTranslations,
            this.channelLanguages,
          ),
        )
        .join("\n\n")

      this.copyState = true
      setTimeout(() => {
        this.copyState = false
      }, 1000)
      navigator.clipboard.writeText(text)
    },
    clearSelectedTurns() {
      // TODO: clear selection when clicking on the background
      this.selectedTurns = []
    },
    keydown(e) {
      if (e.key === "Escape") {
        this.clearSelectedTurns()
      }

      if (e.key === "c" && e.ctrlKey) {
        this.copyTurns()
      }
    },
    closeSubtitleFullscreen() {
      this.$emit("closeSubtitleFullscreen")
    },
    toggleMicrophone() {
      this.$emit("toggleMicrophone")
    },
    onSave() {
      this.$emit("onSave")
    },
  },
  components: {
    Fragment,
    SessionChannelTurn,
    SessionChannelTurnPartial,
    SubtitleFullscreen,
    Svglogo,
    SessionSubtitle,
    Loading,
  },
}
</script>
