<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent sidebar>
    <template v-slot:breadcrumb-actions>
      <SessionHeader
        :sessionListRoute="sessionListRoute"
        :sessionLoaded="sessionLoaded"
        :name="name"
        :session="session">
        <template v-slot:right-button-desktop>
          <router-link
            :to="settingsRoute"
            class="btn"
            v-if="isAtLeastMaintainer">
            <span class="icon settings"></span>
            <span class="label">{{
              $t("session.detail_page.settings_button")
            }}</span>
          </router-link>
        </template>
        <template v-slot:right-button-mobile>
          <div class="flex gap-small">
            <router-link
              :to="settingsRoute"
              class="btn secondary only-icon"
              v-if="isAtLeastMaintainer"
              :aria-label="$t('session.detail_page.settings_button')">
              <span class="icon settings"></span>
            </router-link>
            <button
              class="btn secondary only-icon"
              @click="showMobileSubtitles">
              <span class="icon subtitle"></span>
            </button>
          </div>
        </template>
      </SessionHeader>
    </template>

    <template v-slot:sidebar>
      <SessionLiveMicrophoneStatus
        v-if="useMicrophone && sessionLoaded"
        @toggle-microphone="toggleMicrophone"
        :speaking="speaking"
        :isRecording="isRecording"
        :channelWebsocket="channelAudioWebsocket" />
      <div
        class="session-microphone-status__channel"
        v-if="useMicrophone && currentChannelMicrophone">
        {{
          $t("session.record_to_chanel_name_info", {
            name: currentChannelMicrophone.name,
          })
        }}
      </div>
      <SessionLiveToolbar
        v-if="sessionLoaded"
        :channels="channels"
        :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
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
        @closeSubtitleFullscreen="closeSubtitleFullscreen"
        :showSubtitlesFullscreen="showSubtitlesFullscreen"
        :selectedTranslations="selectedTranslation"
        :organizationId="organizationId"
        :fontSize="fontSize"
        :displaySubtitles="displaySubtitles"
        :displayLiveTranscription="displayLiveTranscription"
        :session="session"
        :selectedChannel="selectedChannel" />

      <SessionDropdownChannelSelector
        class="mobile"
        v-if="sessionLoaded"
        :channels="channels"
        :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
        v-bind:selectedChannel.sync="selectedChannel"
        v-bind:selectedTranslation.sync="selectedTranslation" />

      <ModalNew
        noAction
        title="Setup microphone"
        v-if="showMicrophoneSetup"
        @on-cancel="cancelRecordSettings">
        <SessionSetupMicrophone
          :applyLabel="$t('session.microphone_apply_button')"
          @start-session="startRecordFromMicrophone"
          @trash-session="cancelRecordSettings"></SessionSetupMicrophone>
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
import SessionHeader from "@/components/SessionHeader.vue"

import SessionDropdownChannelSelector from "@/components-mobile/SessionDropdownChannelSelector.vue"
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
      showSubtitlesFullscreen: false,
      currentChannelMicrophone: null,
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
      console.log("currentChannelMicrophone", this.selectedChannel)
      this.currentChannelMicrophone = this.selectedChannel
      this.initMicrophone()
      this.setupRecording(this.selectedChannel)
      this.updateUrl()
    },
    cancelRecordSettings() {
      this.showMicrophoneSetup = false
      this.useMicrophone = false
      this.updateUrl()
    },
    showMobileSubtitles() {
      this.showSubtitlesFullscreen = true
    },
    closeSubtitleFullscreen() {
      this.showSubtitlesFullscreen = false
    },
  },
  computed: {
    qualifiedForCrossSubtitles() {
      let res = true
      res = res && this.selectedChannel.languages.length == 2
      //res = res && this.selectedChannel.translations.length == 2
      res = res && !!this.selectedChannel.translations.find((t) => t.split("-")[0] === this.selectedChannel.languages[0].split("-")[0])
      res = res && !!this.selectedChannel.translations.find((t) => t.split("-")[0] === this.selectedChannel.languages[1].split("-")[0])
      return res
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
    SessionDropdownChannelSelector,
    SessionHeader,
  },
}
</script>
