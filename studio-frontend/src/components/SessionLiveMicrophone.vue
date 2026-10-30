<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:breadcrumb-actions>
      <div
        class="flex1 flex gap-medium align-center"
        style="margin-right: 0.5rem">
        <MicrophoneStatus
          v-if="displayedMicrophoneStatus !== 'idle'"
          :status="displayedMicrophoneStatus"
          :speaking="speaking" />

        <div class="flex1"></div>
        <template v-if="!isSessionTerminated">
          <IsMobile v-if="!isRecordedInOtherTab">
            <Button
              @click="toggleMute"
              variant="secondary"
              :icon="wantsRecording ? 'microphone' : 'microphone-slash'"
              :aria-pressed="String(!wantsRecording)"
              :aria-label="toggleMuteLabel"
              :title="toggleMuteLabel" />
            <template #desktop>
              <Button
                @click="toggleMute"
                variant="secondary"
                size="sm"
                :icon="wantsRecording ? 'microphone' : 'microphone-slash'"
                :aria-pressed="String(!wantsRecording)"
                :label="toggleMuteLabel" />
            </template>
          </IsMobile>
          <SessionLiveActions
            :session="session"
            :showStop="false"
            :showDelete="false"
            :showPauseResume="false"
            fakeStatus="active"
            @cleared="$emit('onSessionUpdated')" />
          <Button
            v-if="editorIsMobile && isFirstChannelLive"
            @click="toggleEditorSidebar"
            variant="secondary"
            icon="person-simple-circle"
            :aria-expanded="String(editorSidebarOpen)"
            :aria-label="$t('session.detail_page.editor_sidebar_button')"
            :title="$t('session.detail_page.editor_sidebar_button')" />
          <IsMobile>
            <Button
              @click="$emit('onSave')"
              icon="stop"
              intent="destructive"
              variant="primary"
              :aria-label="$t('quick_session.live.save_button')"
              :title="$t('quick_session.live.save_button')" />
            <template #desktop>
              <Button
                @click="$emit('onSave')"
                variant="primary"
                size="sm"
                :label="$t('quick_session.live.save_button')" />
            </template>
          </IsMobile>
        </template>
      </div>
    </template>
    <div class="relative flex flex1 col">
      <SessionEnded v-if="isSessionTerminated" :session="session" />
      <template v-else-if="isFirstChannelLive">
        <SessionLiveNG
          ref="sessionLiveNG"
          :currentOrganizationScope="currentOrganizationScope"
          :session="session"
          :websocketInstance="$apiEventWS"
          :microphoneStatus="microphoneStatus"
          @retry-microphone="retryAudioConnection"
          @reconfigure-microphone="showMicrophoneSetup = true"
          @buy-live-pack="openLivePackPurchase"
          @viewport-change="editorIsMobile = $event"
          @sidebar-open="editorSidebarOpen = $event" />
      </template>
      <MicrophonePlaceholder
        v-else-if="displayedMicrophoneStatus !== 'idle'"
        :status="displayedMicrophoneStatus"
        :speaking="speaking"
        @toggle="toggleMute"
        @retry="retryAudioConnection"
        @reconfigure="showMicrophoneSetup = true" />
      <PackPurchaseModal
        v-model="isLivePackPurchaseOpen"
        kind="live"
        @cancel="cancelLivePackPurchase" />
      <Modal
        v-if="!isSessionTerminated"
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
import { quickSessionPauseMixin } from "@/mixins/quickSessionPause.js"

import SessionLiveNG from "@/components/SessionLiveNG.vue"
import Modal from "@/components/molecules/Modal.vue"
import MicrophoneStatus from "@/components/molecules/MicrophoneStatus.vue"
import MicrophonePlaceholder from "@/components/molecules/MicrophonePlaceholder.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionLiveActions from "@/components/SessionLiveActions.vue"
import SessionEnded from "@/components/SessionEnded.vue"
import PackPurchaseModal from "@/components-cloud/PackPurchaseModal.vue"
import TabLock from "@/lib/TabLock.js"

import V2Layout from "@/layouts/v2-layout.vue"

export default {
  mixins: [sessionMicrophoneMixin, quickSessionPauseMixin],
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
      // Opened once the tab lock says this tab is the one recording.
      showMicrophoneSetup: false,
      // Another tab of this browser already records this session: this one
      // only displays it. No takeover, no wait: reloading the page re-checks.
      isRecordedInOtherTab: false,
      // Pushed by the editor, at ITS breakpoint — the app's own isMobile
      // getter switches at 1100px, the editor's sidebar at 767px.
      editorIsMobile: false,
      editorSidebarOpen: false,
    }
  },
  async created() {
    // Plain instance field: the lock is a resource, not reactive state.
    this.microphoneTabLock = new TabLock(
      `quick-session-microphone-${this.session.id}`,
    )
    const isRecordingTab = await this.microphoneTabLock.acquire()
    this.isRecordedInOtherTab = !isRecordingTab
    this.showMicrophoneSetup = isRecordingTab
  },
  beforeDestroy() {
    this.microphoneTabLock.destroy()
  },
  computed: {
    displayedMicrophoneStatus() {
      if (this.isSessionTerminated) return "idle"
      return this.isRecordedInOtherTab ? "other_tab" : this.microphoneStatus
    },
    // Ended or deleted elsewhere, see sessions/applySessionsUpdate
    isSessionTerminated() {
      return this.session.status === "terminated"
    },
    toggleMuteLabel() {
      return this.wantsRecording
        ? this.$t("quick_session.live.mute_microphone_button")
        : this.$t("quick_session.live.start_microphone_button")
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
    toggleEditorSidebar() {
      this.$refs.sessionLiveNG.toggleSidebar()
    },
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
    MicrophonePlaceholder,
    SessionSetupMicrophone,
    SessionLiveActions,
    SessionEnded,
    PackPurchaseModal,
  },
}
</script>
