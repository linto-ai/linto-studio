<template>
  <TranscriptionCreateFrame
    :title="$t('transcription_create.title')"
    @close="$emit('close')"
    @submit="submit">
    <fieldset class="source-step__sources flex col gap-small">
      <legend class="source-step__legend">
        {{ $t("transcription_create.source.question") }}
      </legend>
      <div class="flex gap-small wrap">
        <RadioCard
          v-for="source in sources"
          :key="source.name"
          name="transcription-source"
          :choiceValue="source.name"
          :icon="source.icon"
          :disabled="source.disabled"
          :label="$t(`transcription_create.source.${source.name}`)"
          :value="draft.source"
          @input="$emit('change', { source: $event })" />
      </div>
    </fieldset>

    <NotificationBanner
      v-if="hasNoEngine"
      variant="warning"
      icon="lock-simple"
      align="start">
      {{ $t("conversation.transcription.no_model_for_level") }}
    </NotificationBanner>

    <ConversationCreateAudio
      v-if="draft.source === 'file'"
      :value="files"
      :enableMicrophone="enableFileRecording"
      @input="$emit('update-files', $event)" />

    <NotificationBanner
      v-else-if="draft.source === 'session'"
      variant="info"
      icon="info"
      align="start">
      {{ $t("transcription_create.source.session_next_step") }}
    </NotificationBanner>

    <QuickSessionPlaceholder v-else-if="isQuickSessionRunning" />

    <template v-else>
      <VisioFields
        v-if="draft.source === 'visio'"
        :value="draft.visio"
        :urlError="visioUrlError"
        @input="$emit('change', { visio: $event })" />

      <LiveUnavailableBanner v-if="isLiveUnavailable && !hasNoEngine" />

      <div class="form-field flex col gap-small">
        <span class="form-label">
          {{ $t("transcription_create.timing.label") }}
        </span>
        <SegmentedControl
          block
          :value="draft.timing"
          :options="timingChoices"
          :ariaLabel="$t('transcription_create.timing.label')"
          @input="$emit('change', { timing: $event })" />
      </div>

      <FormCheckbox
        v-if="draft.timing === 'live'"
        :field="keepAudioField"
        :value="draft.keepAudio"
        @input="$emit('change', { keepAudio: $event })" />
    </template>

    <SecurityLevelSelector
      v-if="showSecurityLevel"
      class="source-step__security-level"
      :value="draft.securityLevel"
      :minLevel="minSecurityLevel"
      @input="$emit('change', { securityLevel: $event })" />

    <template #footer>
      <Button type="button" variant="text" @click="$emit('close')">
        {{ $t("transcription_create.cancel") }}
      </Button>
      <Button
        v-if="draft.source === 'session'"
        variant="primary"
        :to="sessionCreateRoute"
        @click.native="$emit('close')">
        {{ $t("transcription_create.source.session_create") }}
      </Button>
      <Button v-else type="submit" variant="primary" :disabled="!canContinue">
        {{ $t("transcription_create.next") }}
      </Button>
    </template>
  </TranscriptionCreateFrame>
</template>
<script>
import EMPTY_FIELD from "@/const/emptyField.js"
import { testVisioUrl } from "@/tools/fields/testVisioUrl"
import { getEnv } from "@/tools/getEnv"
import { isSourceStepComplete } from "@/tools/transcriptionCreate/isSourceStepComplete.js"

import ConversationCreateAudio from "@/components/ConversationCreateAudio.vue"
import QuickSessionPlaceholder from "@/components/QuickSessionPlaceholder.vue"
import SecurityLevelSelector from "@/components/SecurityLevelSelector.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import FormCheckbox from "@/components/molecules/FormCheckbox.vue"
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"
import LiveUnavailableBanner from "./LiveUnavailableBanner.vue"
import RadioCard from "./RadioCard.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"
import VisioFields from "./VisioFields.vue"

export default {
  name: "SourceStep",
  components: {
    ConversationCreateAudio,
    QuickSessionPlaceholder,
    SecurityLevelSelector,
    NotificationBanner,
    FormCheckbox,
    SegmentedControl,
    LiveUnavailableBanner,
    RadioCard,
    TranscriptionCreateFrame,
    VisioFields,
  },
  props: {
    draft: { type: Object, required: true },
    files: { type: Array, required: true },
    // [{ name, icon, disabled }]
    sources: { type: Array, required: true },
    // See computeTimingOptions
    timingOptions: { type: Array, required: true },
    minSecurityLevel: { type: Number, required: true },
    isQuickSessionRunning: { type: Boolean, default: false },
    // Without the microphone source, a file can still be recorded here.
    enableFileRecording: { type: Boolean, default: false },
    organizationId: { type: String, required: true },
  },
  data() {
    return {
      keepAudioField: {
        ...EMPTY_FIELD,
        label: this.$t("session.create_page.keep_audio_label"),
      },
    }
  },
  computed: {
    timingChoices() {
      return this.timingOptions.map((option) => ({
        ...option,
        label: this.$t(`transcription_create.timing.${option.name}`),
      }))
    },
    // Nothing can transcribe this source at the chosen security level.
    hasNoEngine() {
      if (this.draft.source === "session") return false
      const usableTimings = this.timingOptions.filter(
        (option) => !option.disabled,
      )
      return this.draft.source === "file"
        ? !usableTimings.some((option) => option.name === "offline")
        : usableTimings.length === 0
    },
    isLiveUnavailable() {
      return this.timingOptions.some(
        (option) => option.name === "live" && option.disabled,
      )
    },
    isRecording() {
      return ["microphone", "visio"].includes(this.draft.source)
    },
    showSecurityLevel() {
      return (
        getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true" &&
        this.draft.source !== "session" &&
        !(this.isRecording && this.isQuickSessionRunning)
      )
    },
    canContinue() {
      return (
        !(this.isRecording && this.isQuickSessionRunning) &&
        !this.hasNoEngine &&
        !this.visioUrlError &&
        isSourceStepComplete(this.draft, this.files)
      )
    },
    // Each provider can restrict the URLs it accepts.
    visioUrlError() {
      const { url, provider } = this.draft.visio
      if (this.draft.source !== "visio" || !url.trim() || !provider) return null
      const field = { value: url }
      testVisioUrl(field, this.$t.bind(this), provider)
      return field.error
    },
    sessionCreateRoute() {
      return {
        name: "sessions create",
        params: { organizationId: this.organizationId },
      }
    },
  },
  methods: {
    submit() {
      if (this.canContinue) this.$emit("next")
    },
  },
}
</script>
<style lang="scss" scoped>
.source-step__sources {
  margin: 0;
  padding: 0;
  border: 0;
}

.source-step__security-level :deep(select) {
  width: 100%;
  max-width: none;
}

.source-step__legend {
  padding: 0;
  margin-bottom: var(--small-gap);
  font-weight: 600;
}
</style>
