<template>
  <div class="m-page">
    <PageHeader :title="$t('mobile.home.record_title')" />
    <main class="m-page__content m-record-page">
      <InfoBanner v-if="isRecording && !recorder.wakeLockOk" tone="warning">
        {{ $t("mobile.record.keep_screen_on") }}
      </InfoBanner>

      <section class="m-record-page__stage">
        <RecordTimer
          v-if="isRecording"
          :elapsed-ms="recorder.elapsedMs"
          :paused="recorder.state === 'paused'" />
        <LevelMeter
          v-if="recorder.state === 'recording'"
          :level="recorder.level" />
        <RecordButton :state="recorder.state" @click="onMainButton" />
        <button
          v-if="isRecording"
          type="button"
          class="m-record-page__pause"
          @click="togglePause">
          <PhIcon
            :name="recorder.state === 'paused' ? 'play' : 'pause'"
            size="sm"
            weight="fill" />
          {{
            recorder.state === "paused"
              ? $t("mobile.record.resume")
              : $t("mobile.record.pause")
          }}
        </button>
        <p class="m-muted m-record-page__hint">
          {{ $t("mobile.record.local_only") }}
        </p>
      </section>

      <template v-if="!isRecording">
        <TranscriptionSettingsRow
          :summary="transcriptionSummary"
          @click="settingsOpen = true" />
        <ListRow
          icon="microphone"
          :label="$t('mobile.record.microphone')"
          :hint="microphoneLabel"
          class="m-record-page__microphone"
          @click="openMicrophonePicker" />
      </template>

      <PendingRecordingsList
        :recordings="pending"
        :online="online"
        @open-actions="openActions" />

      <ListRow
        v-if="recent.length > 0"
        icon="paper-plane-tilt"
        :label="$t('mobile.queue.recent')"
        :hint="recent[0].name"
        :to="{ name: 'media', query: { status: 'processing' } }"
        class="m-record-page__recent" />
    </main>

    <TranscriptionSettingsSheet
      v-model="settingsOpen"
      :services="services"
      :choices="choices"
      :voice-collections="voiceCollections"
      :voice-identification-capable="speakerIdentificationCapable"
      :organization-id="organizationScope"
      @change="updateChoices" />
    <StopRecordingSheet
      v-model="stopSheetOpen"
      :default-name="stoppedRecording ? stoppedRecording.name : ''"
      :summary="stoppedSummary"
      :online="online"
      :recording-id="stoppedRecording ? stoppedRecording.id : ''"
      :mime-type="stoppedRecording ? stoppedRecording.mimeType : ''"
      :quiet="stoppedQuiet"
      @send="sendStopped"
      @keep="keepStopped" />
    <MicrophoneSheet
      v-model="microphoneSheetOpen"
      :microphones="microphones"
      :loaded="microphonesLoaded"
      :current-id="microphoneId"
      @choose="chooseMicrophone" />
    <RecordingActionsSheet
      v-model="actionsOpen"
      :recording="selected"
      @send="sendRecording"
      @rename="renameRecording"
      @remove="removeRecording" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import PhIcon from "@/components/atoms/PhIcon.vue"
import PageHeader from "@/mobile/components/PageHeader.vue"
import InfoBanner from "@/mobile/components/InfoBanner.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import RecordButton from "@/mobile/components/record/RecordButton.vue"
import RecordTimer from "@/mobile/components/record/RecordTimer.vue"
import LevelMeter from "@/mobile/components/record/LevelMeter.vue"
import TranscriptionSettingsRow from "@/mobile/components/record/TranscriptionSettingsRow.vue"
import TranscriptionSettingsSheet from "@/mobile/components/record/TranscriptionSettingsSheet.vue"
import StopRecordingSheet from "@/mobile/components/record/StopRecordingSheet.vue"
import PendingRecordingsList from "@/mobile/components/record/PendingRecordingsList.vue"
import RecordingActionsSheet from "@/mobile/components/record/RecordingActionsSheet.vue"
import MicrophoneSheet from "@/mobile/components/record/MicrophoneSheet.vue"
import { recordingControllerMixin } from "@/mobile/mixins/recordingController.js"
import { transcriptionSettingsMixin } from "@/mobile/mixins/transcriptionSettings.js"
import { queueActionsMixin } from "@/mobile/mixins/queueActions.js"
import { microphoneChoiceMixin } from "@/mobile/mixins/microphoneChoice.js"
import { onlineStatus } from "@/mobile/services/network/onlineStatus.js"

export default {
  name: "MobileRecord",
  components: {
    PhIcon,
    PageHeader,
    InfoBanner,
    ListRow,
    RecordButton,
    RecordTimer,
    LevelMeter,
    TranscriptionSettingsRow,
    TranscriptionSettingsSheet,
    StopRecordingSheet,
    PendingRecordingsList,
    RecordingActionsSheet,
    MicrophoneSheet,
  },
  mixins: [
    recordingControllerMixin,
    transcriptionSettingsMixin,
    queueActionsMixin,
    microphoneChoiceMixin,
  ],
  data() {
    return { settingsOpen: false }
  },
  computed: {
    ...mapGetters("mobileRecordings", ["pending", "recent"]),
    online() {
      return onlineStatus.online
    },
    isRecording() {
      return (
        this.recorder.state === "recording" || this.recorder.state === "paused"
      )
    },
  },
  created() {
    this.$store.dispatch("mobileRecordings/load")
  },
  methods: {
    onMainButton() {
      if (this.isRecording) {
        this.stopRecording()
      } else if (this.recorder.state === "idle" && this.transcriptionSettings) {
        this.startRecording(this.transcriptionSettings, this.microphoneId)
      }
    },
  },
}
</script>

<style scoped>
.m-record-page {
  gap: var(--m-space-4);
}

.m-record-page__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-4);
  padding: var(--m-space-4) 0;
}

.m-record-page__pause {
  min-width: 160px;
  min-height: var(--m-tap);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--m-space-2);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  font-weight: 600;
}

.m-record-page__hint {
  text-align: center;
  max-width: 320px;
}

.m-record-page__microphone,
.m-record-page__recent {
  border-radius: var(--m-radius);
  box-shadow: var(--m-shadow-1);
}
</style>
