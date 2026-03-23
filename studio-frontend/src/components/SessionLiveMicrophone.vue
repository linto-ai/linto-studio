<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:breadcrumb-actions>
      <div
        class="flex1 flex gap-medium align-center"
        style="margin-right: 0.5rem">
        <IsMobile>
          <template #desktop
            ><StatusLed :on="speaking && isRecording"
          /></template>
        </IsMobile>

        <div class="flex1"></div>
        <Button
          v-if="!isRecording"
          icon="play"
          @click="startMicrophone"
          :label="$t('quick_session.live.start_microphone_button')"
          size="sm"
          variant="secondary" />
        <Button
          v-else
          icon="pause"
          @click="pauseMicrophone"
          :label="$t('quick_session.live.mute_microphone_button')"
          size="sm" />
        <Button
          @click="$emit('onSave')"
          variant="primary"
          size="sm"
          :label="$t('quick_session.live.save_button')" />
      </div>
    </template>
    <div class="relative flex flex1 col">
      <SessionLiveNG
        ref="sessionLiveNG"
        :session="session"
        :websocketInstance="$apiEventWS" />

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
import { microphoneMixin } from "@/mixins/microphone.js"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import SessionLiveNG from "@/components/SessionLiveNG.vue"
import Modal from "@/components/molecules/Modal.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"

import V2Layout from "@/layouts/v2-layout.vue"

export default {
  mixins: [microphoneMixin, sessionMicrophoneMixin],
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
    console.log(this.session)
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
  },
  methods: {
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
    SessionSetupMicrophone,
  },
}
</script>
