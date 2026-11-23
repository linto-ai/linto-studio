<template>
  <div class="m-page">
    <PageHeader :title="$t('mobile.home.record_title')" />
    <main class="m-page__content m-record-page">
      <TranscriptionCreditBanner
        v-if="creditExhausted"
        :reset-at="credit.resetAt" />
      <RecordingStage
        :microphone-id="microphoneId"
        :conversation-settings="conversationSettings"
        @state-change="stageState = $event"
        @stopped="stoppedRecordingId = $event">
        <TranscriptionCreditPill
          v-if="!stageBusy && credit && !creditExhausted"
          :minutes="credit.minutes"
          :synced-at="credit.syncedAt"
          :cached="credit.cached" />
      </RecordingStage>
      <RecordSettings
        v-show="!stageBusy"
        :value="choices"
        :microphone-id="microphoneId"
        :services="services"
        :services-loaded="settingsReady"
        :conversation-settings="conversationSettings"
        :credit-exhausted="creditExhausted"
        @input="updateChoices"
        @update:microphone-id="chooseMicrophone" />
      <RecordingLibrary
        :credit-minutes="creditMinutes"
        :credit-reset-at="credit && credit.resetAt" />
    </main>
    <StopRecordingFlow v-model="stoppedRecordingId" />
  </div>
</template>

<script>
import PageHeader from "@/mobile/components/PageHeader.vue"
import TranscriptionCreditBanner from "@/mobile/components/record/TranscriptionCreditBanner.vue"
import TranscriptionCreditPill from "@/mobile/components/record/TranscriptionCreditPill.vue"
import RecordingStage from "@/mobile/components/record/RecordingStage.vue"
import RecordSettings from "@/mobile/components/record/RecordSettings.vue"
import RecordingLibrary from "@/mobile/components/record/RecordingLibrary.vue"
import StopRecordingFlow from "@/mobile/components/record/StopRecordingFlow.vue"
import { loadTranscriptionServices } from "@/mobile/services/transcription/loadTranscriptionServices.js"
import { loadTranscriptionCredit } from "@/mobile/services/billing/loadTranscriptionCredit.js"
import { subscribeToNetwork } from "@/api/device/network.js"
import {
  readTranscriptionPreferences,
  saveTranscriptionPreferences,
} from "@/api/localStorage/transcriptionPreferences.js"
import {
  readMicrophonePreference,
  saveMicrophonePreference,
} from "@/api/localStorage/microphonePreference.js"
import { computeTranscriptionChoices } from "@/mobile/tools/computeTranscriptionChoices.js"
import { computeConversationSettings } from "@/mobile/tools/computeConversationSettings.ts"
import { DEFAULT_MEMBERS_RIGHT } from "@/mobile/const/defaultMembersRight.js"

// Stage states during which the settings cannot change any more: they are
// frozen on the recording when the microphone starts.
const BUSY_STAGE_STATES = ["starting", "recording", "paused"]

// The Record page: lays out the recording stage, the settings of the next
// recordings, the library, and opens the stop sheet when a recording
// stops. It holds what its parts share (the screen's choices, the
// microphone, the services, the transcription minutes) and turns the
// choices into the settings frozen on a recording. It never sees the
// recorder (RecordingStage) nor writes the recordings (mobileRecordings).
export default {
  name: "MobileRecord",
  components: {
    PageHeader,
    TranscriptionCreditBanner,
    TranscriptionCreditPill,
    RecordingStage,
    RecordSettings,
    RecordingLibrary,
    StopRecordingFlow,
  },
  data() {
    return {
      // TranscriptionChoices, remembered per organization
      choices: {
        serviceName: null,
        language: null,
        diarization: true,
        voiceCollections: [],
        membersRight: DEFAULT_MEMBERS_RIGHT,
        folderId: null,
      },
      microphoneId: readMicrophonePreference(),
      services: [],
      servicesLoaded: false,
      // The folder list was asked for: a folder missing from it was deleted.
      foldersLoaded: false,
      credit: null,
      stageState: "idle",
      stoppedRecordingId: null,
    }
  },
  computed: {
    organizationId() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    stageBusy() {
      return BUSY_STAGE_STATES.includes(this.stageState)
    },
    settingsReady() {
      return this.servicesLoaded && this.foldersLoaded
    },
    // A folder deleted since it was chosen falls back to the inbox.
    existingFolderId() {
      const folder = this.$store.getters["folders/getFolderById"](
        this.choices.folderId,
      )
      return folder ? folder._id : null
    },
    // What a recording started now is sent with; null until known.
    conversationSettings() {
      return this.settingsReady
        ? computeConversationSettings(
            this.services,
            { ...this.choices, folderId: this.existingFolderId },
            this.$store.getters["apiStatus/hasSpeakerIdentification"],
          )
        : null
    },
    creditMinutes() {
      return this.credit?.minutes ?? null
    },
    // A recording refused for a spent quota is never sent again by itself:
    // the user decides what consumes the minutes.
    creditExhausted() {
      return this.credit?.minutes === 0
    },
  },
  created() {
    this.$store.dispatch("mobileRecordings/load")
    this.loadServices()
    this.loadFolders()
    if (this.$store.getters["apiStatus/hasSpeakerIdentification"]) {
      this.$store.dispatch("organizations/loadVoiceprintCollections")
    }
    this.refreshCredit()
    this.stopWatchingNetwork = subscribeToNetwork(this.onNetworkChange)
  },
  beforeDestroy() {
    this.stopWatchingNetwork()
  },
  methods: {
    async loadServices() {
      this.services = await loadTranscriptionServices()
      this.choices = computeTranscriptionChoices(
        this.services,
        readTranscriptionPreferences(this.organizationId),
        this.$i18n.locale,
      )
      this.servicesLoaded = true
    },
    async loadFolders() {
      try {
        await this.$store.dispatch("folders/fetchFolders")
      } catch {
        // Logged by the store: the folder is then dropped (inbox).
      }
      this.foldersLoaded = true
    },
    async refreshCredit() {
      this.credit = await loadTranscriptionCredit(
        this.$store,
        this.organizationId,
      )
    },
    // Opened offline, the page gets its services once the network is back.
    onNetworkChange(online) {
      if (!online) return
      this.refreshCredit()
      if (this.services.length === 0) this.loadServices()
    },
    updateChoices(choices) {
      this.choices = choices
      saveTranscriptionPreferences(this.organizationId, choices)
    },
    chooseMicrophone(deviceId) {
      this.microphoneId = deviceId
      saveMicrophonePreference(deviceId)
    },
  },
}
</script>

<style scoped>
.m-record-page {
  gap: var(--m-space-4);
}
</style>
