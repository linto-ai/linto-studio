<template>
  <div class="m-page">
    <PageHeader :title="$t('mobile.home.record_title')" />
    <main class="m-page__content m-record-page">
      <TranscriptionCreditBanner
        v-if="transcriptionCreditExhausted"
        :reset-at="transcriptionCredit.resetAt" />
      <NotificationBanner
        v-if="isRecording && !recorder.wakeLockOk"
        variant="warning"
        icon="warning"
        align="start"
        role="status">
        {{ $t("mobile.record.keep_screen_on") }}
      </NotificationBanner>

      <section class="m-record-page__stage">
        <RecordTimer
          v-if="isRecording"
          :elapsed-ms="recorder.elapsedMs"
          :paused="recorder.state === 'paused'" />
        <LevelMeter
          v-if="recorder.state === 'recording'"
          :level="recorder.level" />
        <RecordButton :state="recorder.state" @click="onMainButton" />
        <Button
          v-if="isRecording"
          class="m-record-page__pause"
          :icon="recorder.state === 'paused' ? 'play' : 'pause'"
          icon-weight="fill"
          :label="
            recorder.state === 'paused'
              ? $t('mobile.record.resume')
              : $t('mobile.record.pause')
          "
          @click="togglePause" />
        <p class="m-muted m-record-page__hint">
          {{ $t("mobile.record.local_only") }}
        </p>
        <TranscriptionCreditPill
          v-if="
            !isRecording && transcriptionCredit && !transcriptionCreditExhausted
          "
          :minutes="transcriptionCredit.minutes"
          :synced-at="transcriptionCredit.syncedAt"
          :cached="transcriptionCredit.cached" />
      </section>

      <template v-if="!isRecording">
        <TranscriptionSettingsRow
          :title="transcriptionRowTitle"
          :summary="transcriptionSummary"
          @click="settingsOpen = true" />
        <ListRow
          icon="microphone"
          :label="$t('mobile.record.microphone')"
          :hint="microphoneLabel"
          class="m-record-page__microphone"
          @click="openMicrophonePicker" />
      </template>

      <LibraryList
        :recordings="library"
        :local-bytes="localBytes"
        :online="online"
        :credit-minutes="transcriptionCreditMinutes"
        :credit-reset-at="transcriptionCredit && transcriptionCredit.resetAt"
        @open="openRecording" />
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
      :default-keep-audio="stoppedRecording ? stoppedRecording.keepAudio : true"
      :summary="stoppedSummary"
      :online="online"
      :recording-id="stoppedRecording ? stoppedRecording.id : ''"
      :mime-type="stoppedRecording ? stoppedRecording.mimeType : ''"
      :quiet="stoppedQuiet"
      :sharing-summary="sharingSummary"
      @finish="finishStopped"
      @discard="discardStopped" />
    <MicrophoneSheet
      v-model="microphoneSheetOpen"
      :microphones="microphones"
      :loaded="microphonesLoaded"
      :current-id="microphoneId"
      @choose="chooseMicrophone" />
    <RecordingSheet
      v-model="recordingSheetOpen"
      :recording="selected"
      :online="online"
      :credit-minutes="transcriptionCreditMinutes"
      @retry="retryUpload"
      @rename="renameRecording"
      @share-audio="shareAudio"
      @share-document="shareDocument"
      @remove="removeRecording" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import PageHeader from "@/mobile/components/PageHeader.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import ListRow from "@/mobile/components/ListRow.vue"
import RecordButton from "@/mobile/components/record/RecordButton.vue"
import RecordTimer from "@/mobile/components/record/RecordTimer.vue"
import LevelMeter from "@/mobile/components/record/LevelMeter.vue"
import TranscriptionSettingsRow from "@/mobile/components/record/TranscriptionSettingsRow.vue"
import TranscriptionSettingsSheet from "@/mobile/components/record/TranscriptionSettingsSheet.vue"
import StopRecordingSheet from "@/mobile/components/record/StopRecordingSheet.vue"
import LibraryList from "@/mobile/components/record/LibraryList.vue"
import RecordingSheet from "@/mobile/components/record/RecordingSheet.vue"
import MicrophoneSheet from "@/mobile/components/record/MicrophoneSheet.vue"
import TranscriptionCreditPill from "@/mobile/components/record/TranscriptionCreditPill.vue"
import TranscriptionCreditBanner from "@/mobile/components/record/TranscriptionCreditBanner.vue"
import { recordingControllerMixin } from "@/mobile/mixins/recordingController.js"
import { transcriptionSettingsMixin } from "@/mobile/mixins/transcriptionSettings.js"
import { libraryActionsMixin } from "@/mobile/mixins/libraryActions.js"
import { documentShareMixin } from "@/mobile/mixins/documentShare.js"
import { microphoneChoiceMixin } from "@/mobile/mixins/microphoneChoice.js"
import { transcriptionCreditMixin } from "@/mobile/mixins/transcriptionCredit.js"
import { onlineStatus } from "@/mobile/services/network/onlineStatus.js"

export default {
  name: "MobileRecord",
  components: {
    PageHeader,
    NotificationBanner,
    ListRow,
    RecordButton,
    RecordTimer,
    LevelMeter,
    TranscriptionSettingsRow,
    TranscriptionSettingsSheet,
    StopRecordingSheet,
    LibraryList,
    RecordingSheet,
    MicrophoneSheet,
    TranscriptionCreditPill,
    TranscriptionCreditBanner,
  },
  mixins: [
    recordingControllerMixin,
    transcriptionSettingsMixin,
    libraryActionsMixin,
    documentShareMixin,
    microphoneChoiceMixin,
    transcriptionCreditMixin,
  ],
  data() {
    return { settingsOpen: false }
  },
  computed: {
    ...mapGetters("mobileRecordings", ["library", "localBytes"]),
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
      } else if (this.recorder.state === "idle") {
        this.startRecording(this.microphoneId)
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
}

.m-record-page__hint {
  text-align: center;
  max-width: 320px;
}

.m-record-page__microphone {
  border-radius: var(--m-radius);
  box-shadow: var(--m-shadow-1);
}
</style>
