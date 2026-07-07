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
        <MicrophoneStatusBanner
          :status="microphoneStatus"
          @retry="retryAudioConnection"
          @reconfigure="showMicrophoneSetup = true" />
        <SessionLiveNG
          ref="sessionLiveNG"
          :currentOrganizationScope="currentOrganizationScope"
          :session="session"
          :websocketInstance="$apiEventWS" />
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
import MicrophoneStatusBanner from "@/components/molecules/MicrophoneStatusBanner.vue"
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
    }
  },
  computed: {
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
    startRecordFromMicrophone({ deviceId }) {
      this.showMicrophoneSetup = false
      this.deviceId = deviceId
      this.initMicrophone()
      this.setupRecording(this.recordingChannel)
    },
  },
  components: {
    SessionLiveNG,
    V2Layout,
    Modal,
    MicrophoneStatus,
    MicrophoneStatusBanner,
    MicrophonePlaceholder,
    SessionSetupMicrophone,
    SessionLiveActions,
  },
}
</script>
