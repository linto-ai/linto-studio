<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:sidebar>
      <div class="sidebar-divider"></div>
      <!-- <SessionLiveMicrophoneStatus
        @toggle-microphone="toggleMicrophone"
        :speaking="speaking"
        :isRecording="isRecording"
        :channelWebsocket="channelAudioWebsocket" /> -->
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
        :speaking="speaking"
        :isRecording="isRecording"
        @onSave="$emit('onSave')" />

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
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import { microphoneMixin } from "@/mixins/microphone.js"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import { customDebug } from "@/tools/customDebug.js"
import { isQualifiedForCrossSubtitles } from "@/tools/translationUtils.js"

import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import SessionLiveMicrophoneStatus from "@/components/SessionLiveMicrophoneStatus.vue"
import Modal from "@/components/molecules/Modal.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"

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
      deviceId: null,
      showMicrophoneSetup: true,
    }
  },
  mounted() {
    // this.initMicrophone()
    // this.setupRecording(this.selectedChannel)
  },
  computed: {
    qualifiedForCrossSubtitles() {
      return isQualifiedForCrossSubtitles(
        this.selectedChannel.translations,
        this.selectedChannel.languages,
      )
    },
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
      this.setupRecording(this.selectedChannel)
    },
  },
  components: {
    SessionLiveToolbar,
    SessionLiveContent,
    SessionLiveMicrophoneStatus,
    V2Layout,
    Modal,
    SessionSetupMicrophone,
  },
}
</script>
