<template>
  <div class="session-content flex flex1 col" @scroll="handleScroll">
    <!-- <div class="medium-margin">
      <h1 class="center-text session-content__title" v-if="!noTitle">
        {{ title }}
      </h1>
    </div> -->
    <SessionChannel
      v-if="isConnected && isChannelLive"
      @closeSubtitleFullscreen="closeSubtitleFullscreen"
      :password="password"
      :showSubtitlesFullscreen="showSubtitlesFullscreen"
      :selectedTranslations="selectedTranslations"
      :sessionId="session.id"
      :organizationId="organizationId"
      :fontSize="fontSize"
      :channel="selectedChannel"
      :displaySubtitles="displaySubtitles"
      :displayLiveTranscription="displayLiveTranscription"
      :isBottom="isBottom"
      :fromMicrophone="fromMicrophone"
      @toggleMicrophone="$emit('toggleMicrophone')"
      @onSave="$emit('onSave')"
      :watermarkFrequency="watermarkFrequency"
      :watermarkDuration="watermarkDuration"
      :watermarkContent="watermarkContent"
      :watermarkPinned="watermarkPinned"
      :displayWatermark="displayWatermark"
      :websocketInstance="websocketInstance"
      :isRecording="isRecording"></SessionChannel>
    <SessionChannelMicrophoneOffline
      v-else-if="isConnected && !isChannelLive && !fromVisio"
      :channel="selectedChannel"
      :speaking="speaking"
      @toggleMicrophone="$emit('toggleMicrophone')"
      :isRecording="isRecording" />
    <SessionChannelVisioOffline
      v-else-if="isConnected && !isChannelLive && fromVisio"
      :channel="selectedChannel" />
    <Loading v-else></Loading>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"

import { sessionModelMixin } from "@/mixins/sessionModel.js"
import { sessionChannelModelMixin } from "../mixins/sessionChannelModel.js"

import SessionChannel from "@/components/SessionChannel.vue"
import Loading from "@/components/atoms/Loading.vue"
import SessionChannelMicrophoneOffline from "@/components/SessionChannelMicrophoneOffline.vue"
import SessionChannelVisioOffline from "./SessionChannelVisioOffline.vue"

export default {
  mixins: [sessionModelMixin, sessionChannelModelMixin],
  props: {
    selectedChannel: {
      type: Object,
      required: true,
    },
    session: {
      type: Object,
      required: true,
    },
    password: {
      type: String,
      required: false,
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
    selectedTranslations: {
      type: String,
      required: false,
      default: "original",
    },
    customTitle: {
      type: String,
      required: false,
    },
    showSubtitlesFullscreen: {
      type: Boolean,
      required: false,
      default: false,
    },
    noTitle: {
      type: Boolean,
      required: false,
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
    fromVisio: {
      type: Boolean,
      required: false,
      default: false,
    },
    // instance of ApiEventWebSocket
    websocketInstance: {
      required: true,
    },
    speaking: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isConnected: false,
      isBottom: true,
      channelKeyObj: "selectedChannel",
      wakeLock: null,
    }
  },
  mounted() {
    this.init()
    document.addEventListener("visibilitychange", this.renewWakeLock.bind(this))
  },
  beforeDestroy() {
    this.releaseWakeLock()
    document.removeEventListener(
      "visibilitychange",
      this.renewWakeLock.bind(this),
    )
  },
  computed: {
    isInError() {
      return this.channelTranscriberStatus === "errored"
    },
    title() {
      return this.customTitle ?? this.name
    },
    isChannelLive() {
      return this.selectedChannel?.enableLiveTranscripts
    },
  },
  methods: {
    async renewWakeLock() {
      if (this.wakeLock) {
        await this.wakeLock.release()
      }

      await this.aquireWakeLock()
    },
    async aquireWakeLock() {
      try {
        this.wakeLock = await navigator.wakeLock.request("screen")
        this.wakeLock.addEventListener("release", () => {
          this.wakeLock = null
        })
      } catch (error) {
        console.warn("WakeLock error", error)
      }
    },
    async releaseWakeLock() {
      if (this.wakeLock) {
        await this.wakeLock.release()
      }
    },
    async init() {
      this.isConnected = true
      this.aquireWakeLock()
    },
    handleScroll(e) {
      let isBottom =
        e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 150
      if (isBottom !== this.isBottom) {
        this.isBottom = isBottom
      }
    },
    closeSubtitleFullscreen() {
      this.$emit("closeSubtitleFullscreen")
    },
  },
  components: {
    Fragment,
    SessionChannel,
    Loading,
    SessionChannelMicrophoneOffline,
    SessionChannelVisioOffline,
  },
}
</script>
