<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent sidebar>
    <template v-slot:breadcrumb-actions>
      <router-link :to="sessionListRoute" class="btn secondary">
        <span class="icon back"></span>
        <span class="label">{{
          $t("session.detail_page.back_to_listing")
        }}</span>
      </router-link>

      <!-- title -->
      <SessionStatus
        v-if="sessionLoaded"
        :session="session"
        withText
        class="flex1" />

      <router-link :to="settingsRoute" class="btn" v-if="isAtLeastMaintainer">
        <span class="icon settings"></span>
        <span class="label">{{
          $t("session.detail_page.settings_button")
        }}</span>
      </router-link>
    </template>

    <template v-slot:sidebar>
      <SessionLiveMicrophoneStatus
        v-if="useMicrophone && sessionLoaded"
        @toggle-microphone="toggleMicrophone"
        :speaking="speaking"
        :isRecording="isRecording"
        :channelWebsocket="channelAudioWebsocket" />
      <SessionLiveToolbar
        v-if="sessionLoaded"
        :channels="channels"
        v-bind:selectedTranslation.sync="selectedTranslation"
        v-bind:displayLiveTranscription.sync="displayLiveTranscription"
        v-bind:displaySubtitles.sync="displaySubtitles"
        v-bind:fontSize.sync="fontSize"
        v-bind:selectedChannel.sync="selectedChannel" />
    </template>

    <div class="relative flex flex1 col">
      <!-- <SessionNotStarted v-if="isPending" /> -->

      <Loading v-if="!sessionLoaded || !selectedChannel" />

      <SessionEnded
        v-else-if="isTerminated"
        :session="session"
        :isFromPublicLink="isFromPublicLink" />

      <SessionLiveContent
        v-else
        :selectedTranslations="selectedTranslation"
        :organizationId="organizationId"
        :fontSize="fontSize"
        :displaySubtitles="displaySubtitles"
        :displayLiveTranscription="displayLiveTranscription"
        :session="session"
        :selectedChannel="selectedChannel" />

      <ModalNew noAction title="Setup microphone" v-if="showMicrophoneSetup">
        <SessionSetupMicrophone
          @start-session="startRecordFromMicrophone"></SessionSetupMicrophone>
      </ModalNew>
    </div>
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import EMPTY_FIELD from "@/const/emptyField"

import { sessionMixin } from "@/mixins/session.js"
import { orgaRoleMixin } from "@/mixins/orgaRole"
import { microphoneMixin } from "@/mixins/microphone.js"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import Loading from "@/components/Loading.vue"
import SessionEnded from "@/components/SessionEnded.vue"
import SessionStatus from "@/components/SessionStatus.vue"
import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"
import ModalNew from "@/components/ModalNew.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveMicrophoneStatus from "@/components/SessionLiveMicrophoneStatus.vue"
export default {
  mixins: [
    sessionMixin,
    orgaRoleMixin,
    microphoneMixin,
    sessionMicrophoneMixin,
  ],
  props: {},
  data() {
    const {
      subtitles,
      liveTranscription = "true",
      channelId = null,
      microphone = false,
    } = this.$route.query

    return {
      selectedChannel: null,
      selectedTranslation: null,
      fontSize: "40",
      displaySubtitles: subtitles === "true",
      displayLiveTranscription: liveTranscription === "true",
      useMicrophone: microphone === "true",
      startChannelId: Number(channelId),
      deviceId: null,
      showMicrophoneSetup: false,
    }
  },
  created() {
    // TODO:
    // if not started, redirect to home
    // if stopped, redirect to conversation
  },
  mounted() {},
  watch: {
    sessionLoaded() {
      if (this.sessionLoaded) {
        this.selectedChannel =
          (this.startChannelId &&
            this.channels.find((c) => c.id === this.startChannelId)) ||
          this.channels[0]
        this.selectedTranslation = "original"

        if (this.useMicrophone) {
          this.showMicrophoneSetup = true
        }
      }
    },
    displaySubtitles(value) {
      this.updateUrl()
    },
    displayLiveTranscription(value) {
      this.updateUrl()
    },
    selectedChannel() {
      this.selectedTranslation = "original"
    },
  },
  methods: {
    updateUrl() {
      // add liveTranscription and subtitles to url and selectedChannel
      history.pushState(
        {},
        "",
        `${this.$route.path}?subtitles=${this.displaySubtitles}&liveTranscription=${this.displayLiveTranscription}`,
      )
    },
    startRecordFromMicrophone({ deviceId }) {
      this.showMicrophoneSetup = false
      this.deviceId = deviceId
      this.initMicrophone()
      this.setupRecording(this.selectedChannel)
    },
  },
  components: {
    MainContent,
    SessionNotStarted,
    SessionChannelsSelector,
    SessionTranslationSelection,
    SessionLiveContent,
    SessionLiveToolbar,
    Loading,
    SessionEnded,
    SessionStatus,
    ModalNew,
    SessionSetupMicrophone,
    SessionLiveMicrophoneStatus,
  },
}
</script>
