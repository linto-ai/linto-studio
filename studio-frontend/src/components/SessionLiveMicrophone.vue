<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent sidebar>
    <template v-slot:sidebar>
      <SessionLiveMicrophoneStatus
        @toggle-microphone="toggleMicrophone"
        :speaking="speaking"
        :isRecording="isRecording"
        :channelWebsocket="channelAudioWebsocket" />
      <SessionLiveToolbar
        :channels="channels"
        v-bind:selectedTranslation.sync="selectedTranslation"
        v-bind:displayLiveTranscription.sync="displayLiveTranscription"
        v-bind:displaySubtitles.sync="displaySubtitles"
        v-bind:fontSize.sync="fontSize"
        v-bind:selectedChannel.sync="selectedChannel" />
    </template>
    <template v-slot:breadcrumb-actions>
      <slot name="breadcrumb-actions"></slot>
    </template>
    <SessionLiveContent
      :organizationId="currentOrganizationScope"
      displayLiveTranscription
      :session="session"
      :displaySubtitles="displaySubtitles"
      :displayLiveTranscription="displayLiveTranscription"
      :fontSize="fontSize"
      customTitle="Quick meeting"
      :selectedTranslations="selectedTranslation"
      :selectedChannel="selectedChannel" />
  </MainContent>
</template>
<script>
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import { microphoneMixin } from "@/mixins/microphone.js"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import { customDebug } from "@/tools/customDebug.js"

import MainContent from "@/components/MainContent.vue"
import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import SessionLiveMicrophoneStatus from "@/components/SessionLiveMicrophoneStatus.vue"

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
      displaySubtitles: true,
      fontSize: "40",
      selectedChannel: currentChannel,
    }
  },
  mounted() {
    this.initMicrophone()
    this.setupRecording(this.selectedChannel)
  },
  methods: {},
  components: {
    MainContent,
    SessionLiveToolbar,
    SessionLiveContent,
    SessionLiveMicrophoneStatus,
  },
}
</script>
