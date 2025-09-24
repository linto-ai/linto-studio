<template>
  <LayoutV2>
    <template v-slot:breadcrumb-actions>
      <SessionHeader
        :sessionListRoute="sessionListRoute"
        :sessionLoaded="sessionLoaded"
        :name="name"
        :session="session">
        <IsMobile>
          <div class="flex gap-small">
            <Button
              v-if="isAtLeastMeetingManager"
              :to="settingsRoute"
              variant="primary"
              :aria-label="$t('session.detail_page.settings_button')"
              :title="$t('session.detail_page.settings_button')"
              icon="gear" />

            <Button
              @click="showMobileSubtitles"
              variant="secondary"
              icon="closed-captioning" />
          </div>

          <template #desktop>
            <Button
              v-if="isAtLeastMeetingManager"
              :to="settingsRoute"
              variant="primary"
              size="sm"
              :label="$t('session.detail_page.settings_button')"
              icon="gear" />
          </template>
        </IsMobile>
        <!-- <template v-slot:right-button-desktop>
          
        </template>
        <template v-slot:right-button-mobile>
          <div class="flex gap-small">
            
          </div>
        </template> -->
      </SessionHeader>
    </template>

    <template v-slot:sidebar>
      <div class="sidebar-divider"></div>
      <!-- <h1 v-if="sessionLoaded" class="center-text session-live__title">
        {{ name }}
      </h1> -->
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
      <IsMobile>
        <template #desktop>
          <SessionLiveToolbar
            v-if="sessionLoaded"
            :channels="channels"
            :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
            v-bind:selectedTranslation.sync="selectedTranslation"
            v-bind:displayLiveTranscription.sync="displayLiveTranscription"
            v-bind:displaySubtitles.sync="displaySubtitles"
            v-bind:fontSize.sync="fontSize"
            v-bind:selectedChannel.sync="selectedChannel"
            :watermarkContent="watermarkContent"
            :watermarkDuration="watermarkDuration"
            :watermarkFrequency="watermarkFrequency"
            :displayWatermark="displayWatermark"
            :watermarkPinned="watermarkPinned"
            @updateWatermarkSettings="syncWatermarkSettings" />
        </template>
      </IsMobile>
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
        :selectedChannel="selectedChannel"
        :displayWatermark="displayWatermark"
        :watermarkFrequency="watermarkFrequency"
        :watermarkDuration="watermarkDuration"
        :watermarkContent="watermarkContent"
        :watermarkPinned="watermarkPinned" />
      <IsMobile>
        <SessionDropdownChannelSelector
          v-if="sessionLoaded"
          :channels="channels"
          :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
          v-bind:selectedChannel.sync="selectedChannel"
          v-bind:selectedTranslation.sync="selectedTranslation" />
      </IsMobile>
      <ModalNew
        :withActions="false"
        title="Setup microphone"
        v-model="showMicrophoneSetup"
        @on-cancel="cancelRecordSettings">
        <SessionSetupMicrophone
          :applyLabel="$t('session.microphone_apply_button')"
          @start-session="startRecordFromMicrophone"
          @trash-session="cancelRecordSettings"></SessionSetupMicrophone>
      </ModalNew>
    </div>
  </LayoutV2>
</template>
<script>
import { sessionMixin } from "@/mixins/session.js"
import { orgaRoleMixin } from "@/mixins/orgaRole"
import { microphoneMixin } from "@/mixins/microphone.js"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import { getEnv } from "@/tools/getEnv"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import Loading from "@/components/atoms/Loading.vue"
import SessionEnded from "@/components/SessionEnded.vue"
import SessionStatus from "@/components/SessionStatus.vue"
import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"
import ModalNew from "@/components/molecules/Modal.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveMicrophoneStatus from "@/components/SessionLiveMicrophoneStatus.vue"
import SessionHeader from "@/components/SessionHeader.vue"
import LayoutV2 from "@/layouts/v2-layout.vue"
import SessionDropdownChannelSelector from "@/components-mobile/SessionDropdownChannelSelector.vue"
import IsMobile from "../components/atoms/IsMobile.vue"
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
  },
  components: {
    LayoutV2,
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
