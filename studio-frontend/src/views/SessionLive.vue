<template>
  <LayoutV2 :fullscreen="isMobile && !isAuthenticated" noBreadcrumb>
    <template v-slot:breadcrumb-actions>
      <SessionHeader
        :sessionListRoute="sessionListRoute"
        :sessionLoaded="sessionLoaded"
        :name="name"
        :session="session"
        :showActions="isAtLeastMeetingManager && !isFromPublicLink"
        @paused="pauseMicrophone"
        @resumed="startMicrophone">
        <template #before-actions>
          <MicrophoneStatus
            v-if="microphoneStatus !== 'idle'"
            :status="microphoneStatus"
            :speaking="speaking" />
        </template>

        <IsMobile>
          <div class="flex gap-small">
            <Button
              v-if="canCatchup"
              @click="openCatchup"
              variant="secondary"
              :aria-label="$t('chat.catchup_button')"
              :title="$t('chat.catchup_button')"
              icon="sparkle" />

            <Button
              v-if="isAtLeastMeetingManager && !isFromPublicLink"
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
              v-if="canCatchup"
              @click="openCatchup"
              variant="secondary"
              size="sm"
              :label="$t('chat.catchup_button')"
              icon="sparkle" />

            <Button
              v-if="isAtLeastMeetingManager && !isFromPublicLink"
              :to="settingsRoute"
              variant="primary"
              size="sm"
              :label="$t('session.detail_page.settings_button')"
              icon="gear" />
          </template>
        </IsMobile>
      </SessionHeader>
    </template>

    <div class="relative flex flex1 col">
      <Loading v-if="!sessionLoaded || !selectedChannel" />

      <SessionEnded
        v-else-if="isTerminated"
        :session="session"
        :isFromPublicLink="isFromPublicLink" />

      <SessionLiveNG
        v-else
        ref="sessionLiveNG"
        :session="session"
        :initialChannelId="selectedChannel.id"
        :currentOrganizationScope="currentOrganizationScope"
        :websocketInstance="websocketInstance"
        :displaySubtitles="displaySubtitles"
        :isFromPublicLink="isFromPublicLink"
        :microphoneStatus="microphoneStatus"
        @retry-microphone="retryAudioConnection"
        @reconfigure-microphone="showMicrophoneSetup = true" />

      <Modal
        :withActions="false"
        title="Setup microphone"
        v-model="showMicrophoneSetup"
        @on-cancel="cancelRecordSettings">
        <SessionSetupMicrophone
          :applyLabel="$t('session.microphone_apply_button')"
          @start-session="startRecordFromMicrophone"
          @trash-session="cancelRecordSettings"></SessionSetupMicrophone>
      </Modal>

      <Modal
        @submit="fecthSessionWithPassword"
        v-model="waitingPassword"
        :withClose="false"
        :overlayClose="false"
        :withActionCancel="false"
        isForm
        :textActionApply="$t('session.password_modal.apply')"
        :title="$t('session.password_modal.title')">
        <FormInput :field="passwordField" v-model="passwordField.value" />
      </Modal>

      <ChatDrawer />
    </div>
  </LayoutV2>
</template>
<script>
import { mapGetters, mapState } from "vuex"

import { sessionMixin } from "@/mixins/session.js"
import { orgaRoleMixin } from "@/mixins/orgaRole"
import { sessionMicrophoneMixin } from "@/mixins/sessionMicrophone.js"

import { getEnv } from "@/tools/getEnv"
import { isQualifiedForCrossSubtitles } from "@/tools/translationUtils.js"

import Loading from "@/components/atoms/Loading.vue"
import SessionEnded from "@/components/SessionEnded.vue"
import Modal from "@/components/molecules/Modal.vue"
import MicrophoneStatus from "@/components/molecules/MicrophoneStatus.vue"
import SessionSetupMicrophone from "@/components/SessionSetupMicrophone.vue"
import SessionHeader from "@/components/SessionHeader.vue"
import LayoutV2 from "@/layouts/v2-layout.vue"
import SessionDropdownChannelSelector from "@/components-mobile/SessionDropdownChannelSelector.vue"
import IsMobile from "@/components/atoms/IsMobile.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import SessionLiveNG from "@/components/SessionLiveNG.vue"
import ChatDrawer from "@/components/ChatDrawer.vue"

export default {
  mixins: [sessionMixin, orgaRoleMixin, sessionMicrophoneMixin],
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
    }
  },
  created() {
    // TODO:
    // if not started, redirect to home
    // if stopped, redirect to conversation
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$store.dispatch("chat/checkAvailability")
    }
  },
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
      this.updateUrl()
    },
    cancelRecordSettings() {
      this.showMicrophoneSetup = false
      // Only drop microphone mode when nothing was recording yet: cancelling
      // a REconfiguration must not kill the running pipeline.
      if (!this.microphoneStarted) {
        this.useMicrophone = false
        this.updateUrl()
      }
    },
    showMobileSubtitles() {
      this.$refs["sessionLiveNG"].showMobileSubtitles()
      this.showSubtitlesFullscreen = true
    },
    openCatchup() {
      this.$store.dispatch("chat/requestCatchup", {
        scope: {
          kind: "session",
          organizationId: this.currentOrganizationScope,
          sessionId: this.session.id,
          channelId: this.selectedChannel?.id ?? null,
        },
        content: this.$t("chat.catchup_request_message"),
        lang: this.$i18n.locale,
      })
    },
    closeSubtitleFullscreen() {
      this.showSubtitlesFullscreen = false
    },
  },
  computed: {
    qualifiedForCrossSubtitles() {
      return isQualifiedForCrossSubtitles(
        this.selectedChannel.translations,
        this.selectedChannel.languages,
      )
    },
    ...mapGetters("system", ["isMobile"]),
    ...mapGetters("user", ["isAuthenticated"]),
    ...mapState("chat", ["catchupEnabled"]),
    canCatchup() {
      return (
        this.sessionLoaded &&
        !this.isTerminated &&
        this.isAuthenticated &&
        !this.isFromPublicLink &&
        !!this.currentOrganizationScope &&
        this.catchupEnabled
      )
    },
  },
  components: {
    LayoutV2,
    Loading,
    SessionEnded,
    Modal,
    MicrophoneStatus,
    SessionSetupMicrophone,
    SessionDropdownChannelSelector,
    SessionHeader,
    FormInput,
    SessionLiveNG,
    ChatDrawer,
  },
}
</script>
