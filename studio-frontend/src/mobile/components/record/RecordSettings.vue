<template>
  <div class="m-record-settings">
    <TranscriptionSettingsRow
      :title="
        creditExhausted ? $t('mobile.settings.title_credit_exhausted') : ''
      "
      :summary="summary"
      @click="settingsOpen = true" />
    <ListRow
      v-if="canChooseMicrophone"
      icon="microphone"
      :label="$t('mobile.record.microphone')"
      :hint="microphoneLabel"
      class="m-record-settings__microphone"
      @click="openMicrophonePicker" />

    <TranscriptionSettingsSheet
      v-model="settingsOpen"
      :services="services"
      :choices="value"
      :voice-collections="voiceCollections"
      :voice-identification-capable="speakerIdentificationCapable"
      :organization-id="organizationId"
      @change="updateChoices" />
    <MicrophoneSheet
      v-model="microphoneSheetOpen"
      :microphones="microphones"
      :loaded="microphonesLoaded"
      :current-id="microphoneId"
      @choose="chooseMicrophone" />
  </div>
</template>

<script>
import ListRow from "@/mobile/components/ListRow.vue"
import TranscriptionSettingsRow from "@/mobile/components/record/TranscriptionSettingsRow.vue"
import TranscriptionSettingsSheet from "@/mobile/components/record/TranscriptionSettingsSheet.vue"
import MicrophoneSheet from "@/mobile/components/record/MicrophoneSheet.vue"
import { listMicrophones } from "@/api/device/listMicrophones.js"
import { pickRecommendedService } from "@/mobile/tools/pickRecommendedService.js"
import { computeTranscriptionChoices } from "@/mobile/tools/computeTranscriptionChoices.js"
import { isSpeakerIdentificationCapable } from "@/mobile/tools/isSpeakerIdentificationCapable.js"
import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"
import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"

// The settings of the next recordings on the Record page: transcription
// and sharing (v-model: the screen's choices, TranscriptionChoices) and
// the microphone ("update:microphone-id"). Emits choices that hold
// together: a new service starts again from its own languages. The
// summary shows what will be sent (conversationSettings, computed by the
// page from the same choices).
export default {
  name: "RecordSettings",
  components: {
    ListRow,
    TranscriptionSettingsRow,
    TranscriptionSettingsSheet,
    MicrophoneSheet,
  },
  props: {
    value: { type: Object, required: true },
    microphoneId: { type: String, default: null },
    services: { type: Array, required: true },
    servicesLoaded: { type: Boolean, default: false },
    // ConversationSettings for these choices, null while loading
    conversationSettings: { type: Object, default: null },
    creditExhausted: { type: Boolean, default: false },
  },
  data() {
    return {
      settingsOpen: false,
      microphoneSheetOpen: false,
      microphones: [],
      microphonesLoaded: false,
      // The native recorder always uses the phone's default input.
      canChooseMicrophone: !IS_NATIVE_APP,
    }
  },
  computed: {
    organizationId() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    voiceCollections() {
      return this.$store.getters["organizations/getVoiceprintCollections"]
    },
    currentService() {
      return pickRecommendedService(this.services, this.value.serviceName)
    },
    speakerIdentificationCapable() {
      return isSpeakerIdentificationCapable(
        this.currentService,
        this.$store.getters["apiStatus/hasSpeakerIdentification"],
      )
    },
    summary() {
      switch (true) {
        case !this.servicesLoaded:
          return this.$t("mobile.common.loading")
        case !this.currentService || !this.conversationSettings?.transcription:
          return this.$t("mobile.settings.no_service")
        default:
          return this.describeSettings()
      }
    },
    microphoneLabel() {
      const chosen = this.microphones.find(
        (microphone) => microphone.deviceId === this.microphoneId,
      )
      return chosen?.label ?? this.$t("mobile.record.microphone_default")
    },
  },
  methods: {
    updateChoices(choices) {
      const serviceChanged = choices.serviceName !== this.value.serviceName
      this.$emit(
        "input",
        serviceChanged
          ? computeTranscriptionChoices(
              this.services,
              { ...choices, language: null },
              this.$i18n.locale,
            )
          : choices,
      )
    },
    async openMicrophonePicker() {
      this.microphoneSheetOpen = true
      if (this.microphonesLoaded) return
      this.microphones = await listMicrophones()
      this.microphonesLoaded = true
    },
    chooseMicrophone(deviceId) {
      this.microphoneSheetOpen = false
      this.$emit("update:microphone-id", deviceId)
    },
    describeSettings() {
      const settings = this.conversationSettings.transcription
      const language = this.languageLabel(this.value.language)
      const service = getDescriptionByLanguage(
        this.currentService.desc,
        this.$i18n.locale,
        this.currentService.serviceName,
      )
      const speakers = settings.transcriptionConfig.diarizationConfig
        ?.enableDiarization
        ? this.$t("mobile.settings.speakers_auto")
        : this.$t("mobile.settings.speakers_off")
      const voices =
        settings.speakerIdentificationCollections.length > 0
          ? ` · ${this.$t("mobile.settings.voices_on")}`
          : ""
      return `${language} · ${service} · ${speakers}${voices}`
    },
    languageLabel(language) {
      return !language || language === "*"
        ? this.$t("lang.automatic")
        : this.$t(`lang.${language.slice(0, 2)}`)
    },
  },
}
</script>

<style scoped>
.m-record-settings {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

.m-record-settings__microphone {
  border-radius: var(--m-radius);
  box-shadow: var(--m-shadow-1);
}
</style>
