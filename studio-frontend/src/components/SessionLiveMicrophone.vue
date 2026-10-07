<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:breadcrumb-actions>
      <div
        class="flex1 flex gap-medium align-center"
        style="margin-right: 0.5rem">
        <MicrophoneStatus
          v-if="microphoneStatus !== 'idle'"
          :status="microphoneStatus"
          :speaking="speaking" />

        <div class="flex1"></div>
        <Button
          @click="toggleMute"
          variant="secondary"
          size="sm"
          :icon="wantsRecording ? 'microphone' : 'microphone-slash'"
          :aria-pressed="String(!wantsRecording)"
          :label="
            wantsRecording
              ? $t('quick_session.live.mute_microphone_button')
              : $t('quick_session.live.start_microphone_button')
          " />
        <SessionLiveActions
          :session="session"
          :showStop="false"
          :showDelete="false"
          :showPauseResume="false"
          fakeStatus="active"
          @cleared="$emit('onSessionUpdated')" />
        <Button
          @click="$emit('onSave')"
          variant="primary"
          size="sm"
          :label="$t('quick_session.live.save_button')" />
      </div>
    </template>
    <div class="relative flex flex1 col">
      <template v-if="isFirstChannelLive">
        <SessionLiveNG
          ref="sessionLiveNG"
          :currentOrganizationScope="currentOrganizationScope"
          :session="session"
          :websocketInstance="$apiEventWS"
          :microphoneStatus="microphoneStatus"
          @retry-microphone="retryAudioConnection"
          @reconfigure-microphone="showMicrophoneSetup = true"
          @buy-live-pack="pauseForPackPurchase"
          @live-pack-purchase-cancel="undoPackPurchasePause" />
      </template>
      <MicrophonePlaceholder
        v-else-if="microphoneStatus !== 'idle'"
        :status="microphoneStatus"
        :speaking="speaking"
        @toggle="toggleMute"
        @retry="retryAudioConnection"
        @reconfigure="showMicrophoneSetup = true" />
      <Modal
        :withActions="false"
        :title="$t('session.microphone_setup_title')"
        :overlayClose="false"
        :withClose="false"
        v-model="showMicrophoneSetup">
        <SessionSetupMicrophone
          :applyLabel="$t('session.microphone_apply_button')"
          noCancel
          @start-session="startRecordFromMicrophone"></SessionSetupMicrophone>
      </Modal>
    </div>
  </V2Layout>
</template>
<script>
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import SessionLiveNG from "@/components/SessionLiveNG.vue"
import Modal from "@/components/molecules/Modal.vue"
import MicrophoneStatus from "@/components/molecules/MicrophoneStatus.vue"
import MicrophonePlaceholder from "@/components/molecules/MicrophonePlaceholder.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveActions from "@/components/SessionLiveActions.vue"

import V2Layout from "@/layouts/v2-layout.vue"

export default {
  mixins: [sessionMicrophoneMixin],
  props: {
    session: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    currentChannel: {
      type: Object,
      required: false,
    },
  },
  data() {
    const recordingChannel = this.currentChannel || this.session.channels[0]
    return {
      recordingChannel,
      deviceId: null,
      showMicrophoneSetup: true,
      // What pauseForPackPurchase changed, undone if the purchase is dropped
      // (closed without leaving for the payment page).
      packPurchasePause: null,
    }
  },
  computed: {
    isSessionPaused() {
      return this.session.status === "paused"
    },
    breadcrumbItems() {
      return [
        {
          label: this.$t("breadcrumb.quickSession_microphone"),
        },
      ]
    },
    isFirstChannelLive() {
      return this?.session?.channels?.[0]?.enableLiveTranscripts
    },
  },
  methods: {
    toggleMute() {
      if (this.wantsRecording) {
        this.pauseMicrophone()
      } else {
        this.startMicrophone()
      }
    },
    // Leaving for the payment page: stop sending audio and stop the live
    // server-side (and its credit count). Recording resumes by hand.
    async pauseForPackPurchase() {
      this.packPurchasePause = {
        micWasRecording: this.wantsRecording,
        sessionPaused: false,
      }
      this.pauseMicrophone()
      if (this.isSessionPaused) return
      const paused = await this.$store.dispatch(
        "quickSession/pauseQuickSession",
      )
      if (this.packPurchasePause) {
        this.packPurchasePause.sessionPaused = paused
      } else if (paused) {
        // Purchase dropped while the pause was on its way
        this.resumeSession()
      }
    },
    undoPackPurchasePause() {
      if (!this.packPurchasePause) return
      const { micWasRecording, sessionPaused } = this.packPurchasePause
      this.packPurchasePause = null
      if (micWasRecording) {
        // The wantsRecording watcher resumes the session
        this.startMicrophone()
      } else if (sessionPaused) {
        this.resumeSession()
      }
    },
    async resumeSession() {
      const resumed = await this.$store.dispatch(
        "quickSession/resumeQuickSession",
      )
      if (!resumed) {
        this.$store.dispatch(
          "system/showError",
          this.$t("session.detail_page.resume_session_error_message"),
        )
      }
      return resumed
    },
    // Recording into a paused session would be lost: resume it, or give up
    // recording if the server refuses (e.g. live credit still spent).
    async resumeSessionForRecording() {
      if (await this.resumeSession()) return
      this.pauseMicrophone()
    },
    startRecordFromMicrophone({ deviceId }) {
      this.showMicrophoneSetup = false
      this.deviceId = deviceId
      this.initMicrophone()
      this.setupRecording(this.recordingChannel)
    },
  },
  watch: {
    // Any way back to recording (mute toggle, microphone setup after the
    // payment page, dropped purchase) needs a live session.
    wantsRecording(wantsRecording) {
      if (wantsRecording && this.isSessionPaused) {
        this.resumeSessionForRecording()
      }
    },
  },
  components: {
    SessionLiveNG,
    V2Layout,
    Modal,
    MicrophoneStatus,
    MicrophonePlaceholder,
    SessionSetupMicrophone,
    SessionLiveActions,
  },
}
</script>
