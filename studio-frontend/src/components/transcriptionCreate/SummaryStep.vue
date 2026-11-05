<template>
  <TranscriptionCreateFrame
    :title="$t('transcription_create.title')"
    :locked="sending"
    @close="$emit('close')"
    @submit="$emit('submit')">
    <template #context>
      <SummaryFiles
        v-if="draft.source === 'file'"
        class="summary-step__context"
        :files="files"
        :durations="fileDurations"
        :details="contextDetails"
        :uploadProgress="uploadProgress" />
      <p
        v-else
        class="summary-step__context summary-step__source flex align-center gap-small">
        <ph-icon :name="sourceIcon" size="sm" />
        <strong>{{ sourceLabel }}</strong>
        <span v-if="contextDetails">· {{ contextDetails }}</span>
      </p>
    </template>

    <NotificationBanner
      v-for="notice in notices"
      :key="notice.key"
      variant="info"
      icon="info"
      align="start">
      {{
        $t(`transcription_create.notices.${notice.key}`, {
          languages: formatLanguages(notice.codes),
        })
      }}
    </NotificationBanner>

    <dl class="summary-step__rows flex col">
      <SummaryRow
        icon="globe"
        :label="$t('transcription_create.summary.language')">
        <LanguagePicker
          :label="$t('transcription_create.summary.language')"
          :value="draft.languages"
          :options="languageOptions"
          :disabled="sending"
          @input="$emit('change-languages', $event)" />
      </SummaryRow>

      <SummaryRow
        v-if="isLive"
        icon="translate"
        :label="$t('transcription_create.summary.translation')">
        <LanguagePicker
          v-if="translationOptions.length > 0"
          :label="$t('transcription_create.summary.translation')"
          :value="draft.translations"
          :options="translationOptions"
          :placeholder="$t('transcription_create.summary.none')"
          :disabled="sending"
          @input="$emit('change', { translations: $event })" />
        <template v-else>{{
          $t("transcription_create.summary.none")
        }}</template>
      </SummaryRow>

      <!-- Nothing to choose with a single engine; with none, the row says why
           the transcription can't start. -->
      <SummaryRow
        v-if="isLive && liveEngines.length !== 1"
        icon="cpu"
        :label="$t('transcription_create.summary.live_engine')">
        <SummarySelect
          v-if="liveEngines.length > 0"
          :label="$t('transcription_create.summary.live_engine')"
          :items="liveEngines"
          :value="draft.profileId"
          :disabled="sending"
          @input="
            $emit('change', { profileId: $event, profileChosenByUser: true })
          " />
        <template v-else>{{ noEngineLabel }}</template>
      </SummaryRow>

      <SummaryRow
        v-if="isOffline && offlineEngines.length !== 1"
        icon="cpu"
        :label="offlineEngineLabel">
        <SummarySelect
          v-if="offlineEngines.length > 0"
          :label="offlineEngineLabel"
          :items="offlineEngines"
          :value="draft.serviceName"
          :disabled="sending"
          @input="
            $emit('change', { serviceName: $event, serviceChosenByUser: true })
          " />
        <template v-else>{{ noEngineLabel }}</template>
      </SummaryRow>

      <SummaryRow
        icon="users"
        :label="$t('transcription_create.summary.speaker_separation')">
        <span class="flex align-center gap-small">
          <SwitchInput
            id="transcription-speaker-separation"
            :ariaLabel="$t('transcription_create.summary.speaker_separation')"
            :value="draft.speakers.isSeparated"
            :disabled="sending || !speakerOptions.separation.isAvailable"
            @input="changeSpeakers({ isSeparated: $event })" />
          <label
            class="summary-step__switch-state"
            for="transcription-speaker-separation">
            {{ separationStateLabel }}
          </label>
          <small v-if="separationNotice" class="summary-step__note">
            {{
              $t(`transcription_create.speakers.notices.${separationNotice}`)
            }}
          </small>
        </span>
      </SummaryRow>

      <SummaryRow
        v-if="draft.speakers.isSeparated && speakerOptions.isCountAvailable"
        :label="$t('transcription_create.summary.speaker_count')">
        <SpeakerCountField
          :label="$t('transcription_create.summary.speaker_count')"
          :value="draft.speakers.count"
          :disabled="sending"
          @input="changeSpeakers({ count: $event })" />
      </SummaryRow>

      <SummaryRow
        v-if="
          draft.speakers.isSeparated &&
          speakerOptions.identification.isAvailable
        "
        :label="$t('transcription_create.summary.speaker_identification')">
        <PopoverList
          selection
          multiple
          fullWidth
          :selectAll="false"
          :closeOnClick="false"
          :items="collectionItems"
          :value="draft.speakers.collectionIds"
          :ariaLabel="$t('transcription_create.summary.speaker_identification')"
          :placeholder="$t('transcription_create.speakers.no_identification')"
          :disabled="sending"
          @input="changeSpeakers({ collectionIds: $event })" />
      </SummaryRow>

      <SummaryRow
        icon="share-network"
        :label="$t('transcription_create.summary.sharing')">
        <SummarySelect
          :label="$t('transcription_create.summary.sharing')"
          :items="rightItems"
          :value="draft.membersRight"
          :disabled="sending || isFolderPrivate"
          @input="$emit('change', { membersRight: $event })" />
      </SummaryRow>

      <SummaryRow
        v-if="draft.source === 'file'"
        icon="folder"
        :label="$t('transcription_create.summary.folder')">
        <FolderSelector
          size="md"
          :value="draft.folderId"
          :readonly="sending"
          @input="$emit('change', { folderId: $event })" />
      </SummaryRow>

      <SummaryRow
        v-if="draft.source === 'visio' && isLive"
        withEdit
        icon="subtitles"
        :label="$t('transcription_create.summary.visio_subtitles')"
        :value="visioSubtitlesLabel"
        :disabled="sending"
        @edit="$emit('edit', 'visioSubtitles')" />
    </dl>

    <template #footer-message>
      <p v-if="error" class="error-field" role="alert">{{ error }}</p>
    </template>

    <template #footer-start>
      <Button
        type="button"
        variant="secondary"
        :disabled="sending"
        @click="$emit('back')">
        {{ $t("transcription_create.back") }}
      </Button>
    </template>

    <template #footer>
      <Button
        type="button"
        variant="text"
        :disabled="sending"
        @click="$emit('close')">
        {{ $t("transcription_create.cancel") }}
      </Button>
      <Button
        type="submit"
        variant="primary"
        :icon="sourceIcon"
        :loading="sending"
        :disabled="sending || !isComplete">
        {{ submitLabel }}
      </Button>
    </template>
  </TranscriptionCreateFrame>
</template>
<script>
import RIGHTS_LIST from "@/const/rigthsList"
import SECURITY_LEVELS_LIST from "@/const/securityLevelsList"
import { AUTO_LANGUAGE } from "@/const/transcriptionCreate.js"
import formatLanguage from "@/tools/formatLanguage"
import { getEnv } from "@/tools/getEnv"
import { computeOfferedLanguageCodes } from "@/tools/transcriptionCreate/computeOfferedLanguageCodes.js"
import { computeTranslationOptions } from "@/tools/transcriptionCreate/computeTranslationOptions.js"
import { formatLanguageList } from "@/tools/transcriptionCreate/formatLanguageList.js"
import { isDraftComplete } from "@/tools/transcriptionCreate/isDraftComplete.js"
import { isLiveRequested } from "@/tools/transcriptionCreate/isLiveRequested.js"
import { isOfflineRequested } from "@/tools/transcriptionCreate/isOfflineRequested.js"

import FolderSelector from "@/components/FolderSelector.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import SwitchInput from "@/components/atoms/SwitchInput.vue"
import LanguagePicker from "./LanguagePicker.vue"
import SpeakerCountField from "./SpeakerCountField.vue"
import SummaryFiles from "./SummaryFiles.vue"
import SummaryRow from "./SummaryRow.vue"
import SummarySelect from "./SummarySelect.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "SummaryStep",
  components: {
    FolderSelector,
    NotificationBanner,
    PopoverList,
    SwitchInput,
    LanguagePicker,
    SpeakerCountField,
    SummaryFiles,
    SummaryRow,
    SummarySelect,
    TranscriptionCreateFrame,
  },
  props: {
    draft: { type: Object, required: true },
    // Files still to send, for the "file" source
    files: { type: Array, required: true },
    // Seconds by file id. null when unknown or not read yet.
    fileDurations: { type: Object, required: true },
    catalog: { type: Object, required: true },
    // { profile, service }, see computeDraftEngines
    engines: { type: Object, required: true },
    // See reconcileDraft
    notices: { type: Array, required: true },
    // See computeSpeakerOptions
    speakerOptions: { type: Object, required: true },
    // Compatible engines: [{ id, name, description }]
    liveEngines: { type: Array, required: true },
    offlineEngines: { type: Array, required: true },
    sourceIcon: { type: String, required: true },
    offlineEngineLabel: { type: String, required: true },
    isFolderPrivate: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
    // { index, total, percent } while files are being sent
    uploadProgress: { type: Object, default: null },
    error: { type: String, default: null },
  },
  computed: {
    isLive() {
      return isLiveRequested(this.draft)
    },
    isOffline() {
      return isOfflineRequested(this.draft)
    },
    isComplete() {
      return isDraftComplete(this.draft, this.engines)
    },
    sourceLabel() {
      return this.$t(`transcription_create.source.${this.draft.source}`)
    },
    // Keeps the count of the start while the sent files leave the list.
    submitLabel() {
      const count = this.uploadProgress?.total ?? this.files.length
      return this.$tc(
        `transcription_create.submit.${this.draft.source}`,
        count,
        {
          count,
        },
      )
    },
    contextDetails() {
      const parts = []
      if (this.draft.source !== "file") {
        parts.push(
          this.$t(`transcription_create.timing.${this.draft.timing}_summary`),
        )
      }
      if (getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true") {
        parts.push(this.securityLevelLabel)
      }
      return parts.join(" · ")
    },
    securityLevelLabel() {
      return SECURITY_LEVELS_LIST(this.$t.bind(this)).find(
        (level) => level.value === this.draft.securityLevel,
      )?.txt
    },
    languageOptions() {
      return computeOfferedLanguageCodes(this.draft, this.catalog).map(
        (code) => ({ code }),
      )
    },
    translationOptions() {
      return computeTranslationOptions(this.draft, this.catalog)
    },
    noEngineLabel() {
      return this.$t("transcription_create.summary.no_engine")
    },
    separationStateLabel() {
      const state = this.draft.speakers.isSeparated ? "enabled" : "disabled"
      return this.$t(`transcription_create.speakers.${state}`)
    },
    // Why the switch is locked, or the limits of what it has turned on.
    separationNotice() {
      const { isAvailable, notice } = this.speakerOptions.separation
      return !isAvailable || this.draft.speakers.isSeparated ? notice : null
    },
    collectionItems() {
      return this.catalog.collections.map(({ _id, name }) => ({
        id: _id,
        name,
      }))
    },
    rightItems() {
      return RIGHTS_LIST(this.$t.bind(this)).map(({ value, txt }) => ({
        value,
        name: txt,
      }))
    },
    visioSubtitlesLabel() {
      const { showSubtitles, subtitleSource } = this.draft.visio
      if (!showSubtitles) return this.$t("transcription_create.summary.none")
      return subtitleSource === "original"
        ? this.$t("session.live_page.translation_selector.original_language")
        : this.formatLanguage(subtitleSource)
    },
  },
  methods: {
    changeSpeakers(change) {
      this.$emit("change", {
        speakers: { ...this.draft.speakers, ...change },
        speakersChosenByUser: true,
      })
    },
    formatLanguage(code) {
      return code === AUTO_LANGUAGE
        ? this.$t("transcription_create.language.detection")
        : formatLanguage(code, { locale: this.$i18n.locale })
    },
    formatLanguages(codes = []) {
      return formatLanguageList(codes, this.$i18n.locale)
    },
  },
}
</script>
<style lang="scss" scoped>
.summary-step__context {
  margin: 0;
  padding: var(--small-gap) 0;
  font-size: var(--text-sm);
  background: var(--neutral-10);
  border-bottom: var(--border-block);
}

.summary-step__source {
  padding-inline: var(--large-gap);
}

.summary-step__rows {
  margin: 0;
}

.summary-step__note {
  font-weight: normal;
  color: var(--text-secondary);
}

.summary-step__switch-state {
  margin: 0;
  font-weight: 600;
  cursor: pointer;
}
</style>
