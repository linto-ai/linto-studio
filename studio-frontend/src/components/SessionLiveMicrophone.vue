<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:sidebar>
      <div class="sidebar-divider"></div>
      <SessionLiveMicrophoneStatus
        @toggle-microphone="toggleMicrophone"
        :speaking="speaking"
        :isRecording="isRecording"
        :channelWebsocket="channelAudioWebsocket" />
      <SessionLiveToolbar
        :channels="channels"
        :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
        v-bind:selectedTranslation.sync="selectedTranslation"
        v-bind:displayLiveTranscription.sync="displayLiveTranscription"
        v-bind:displaySubtitles.sync="displaySubtitles"
        v-bind:fontSize.sync="fontSize"
        v-bind:selectedChannel.sync="selectedChannel"
        quickSession />
    </template>
    <template v-slot:breadcrumb-actions>
      <slot name="breadcrumb-actions"></slot>
    </template>
    <SessionLiveContent
      :websocketInstance="$apiEventWS"
      :organizationId="currentOrganizationScope"
      displayLiveTranscription
      :session="session"
      :displaySubtitles="displaySubtitles"
      :displayLiveTranscription="displayLiveTranscription"
      :fontSize="fontSize"
      noTitle
      :selectedTranslations="selectedTranslation"
      :selectedChannel="selectedChannel"
      fromMicrophone
      @toggleMicrophone="toggleMicrophone"
      :isRecording="isRecording"
      @onSave="$emit('onSave')" />
  </V2Layout>
</template>
<script>
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import { microphoneMixin } from "@/mixins/microphone.js"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import { customDebug } from "@/tools/customDebug.js"

import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import SessionLiveMicrophoneStatus from "@/components/SessionLiveMicrophoneStatus.vue"
import V2Layout from "@/layouts/v2-layout.vue"

export default {
  mixins: [sessionModelMixin, microphoneMixin, sessionMicrophoneMixin],
  props: {
    session: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    currentChannel: {
      type: Object,
      required: false,
    },
  },
  data() {
    const currentChannel = this.currentChannel || this.session.channels[0]
    return {
      selectedTranslation: "original",
      displayLiveTranscription: true,
      displaySubtitles: false,
      fontSize: "40",
      selectedChannel: currentChannel,
    }
  },
  mounted() {
    this.initMicrophone()
    this.setupRecording(this.selectedChannel)
  },
  computed: {
    qualifiedForCrossSubtitles() {
      let res = true
      res = res && this.selectedChannel.languages.length == 2
      //res = res && this.selectedChannel.translations.length == 2
      res =
        res &&
        !!this.selectedChannel.translations.find(
          (t) =>
            t.split("-")[0] === this.selectedChannel.languages[0].split("-")[0],
        )
      res =
        res &&
        !!this.selectedChannel.translations.find(
          (t) =>
            t.split("-")[0] === this.selectedChannel.languages[1].split("-")[0],
        )
      return res
    },
    breadcrumbItems() {
      return [
        {
          label: this.$t("breadcrumb.quickSession"),
        },
      ]
    },
  },
  methods: {},
  components: {
    SessionLiveToolbar,
    SessionLiveContent,
    SessionLiveMicrophoneStatus,
    V2Layout,
  },
}
</script>
