<template>
  <div class="session-content flex flex1 col" @scroll="handleScroll">
    <!-- <div class="medium-margin">
      <h1 class="center-text session-content__title" v-if="!noTitle">
        {{ title }}
      </h1>
    </div> -->
    <SessionChannel
      v-if="isConnected"
      @closeSubtitleFullscreen="closeSubtitleFullscreen"
      :showSubtitlesFullscreen="showSubtitlesFullscreen"
      :selectedTranslations="selectedTranslations"
      :sessionId="session.id"
      :organizationId="organizationId"
      :fontSize="fontSize"
      :channel="selectedChannel"
      :displaySubtitles="displaySubtitles"
      :displayLiveTranscription="displayLiveTranscription"
      :isBottom="isBottom"
      fromMicrophone
      @toggleMicrophone="$emit('toggleMicrophone')"
      @onSave="$emit('onSave')"
      :watermarkFrequency="watermarkFrequency"
      :watermarkDuration="watermarkDuration"
      :watermarkContent="watermarkContent"
      :watermarkPinned="watermarkPinned"
      :displayWatermark="displayWatermark"
      :isRecording="isRecording"></SessionChannel>
    <Loading v-else></Loading>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import SessionWS from "@/models/SessionWS.js"
import { getEnv } from "@/tools/getEnv"

import { sessionModelMixin } from "@/mixins/sessionModel.js"
import { sessionChannelModelMixin } from "../mixins/sessionChannelModel.js"

import SessionChannel from "@/components/SessionChannel.vue"
import Loading from "@/components/Loading.vue"

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
    watermarkFrequency: {
      type: Number,
      required: false,
      default: Number(getEnv("VUE_APP_WATERMARK_FREQUENCY")),
    },
    watermarkDuration: {
      type: Number,
      required: true,
      default: Number(getEnv("VUE_APP_WATERMARK_DURATION")),
    },
    watermarkContent: {
      type: String,
      required: true,
      default: getEnv("VUE_APP_WATERMARK_CONTENT"),
    },
    watermarkPinned: {
      type: Boolean,
      required: true,
      default: false,
    },
    displayWatermark: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      isConnected: false,
      isBottom: true,
      channelKeyObj: "selectedChannel",
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {},
  computed: {
    isInError() {
      return this.channelTranscriberStatus === "errored"
    },
    title() {
      return this.customTitle ?? this.name
    },
  },
  methods: {
    async init() {
      this.isConnected = true
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
  components: { Fragment, SessionChannel, Loading },
}
</script>
