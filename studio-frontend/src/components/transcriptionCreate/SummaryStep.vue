<template>
  <TranscriptionCreateFrame
    :title="$t('transcription_create.title')"
    :locked="sending"
    @close="$emit('close')"
    @submit="$emit('submit')">
    <template #context>
      <p class="summary-step__context flex align-center gap-small">
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
      <SummaryRow :label="$t('transcription_create.summary.language')">
        <span class="flex gap-tiny wrap">
          <Chip
            v-for="code in draft.languages"
            :key="code"
            primary
            :value="formatLanguage(code)" />
        </span>
        <small
          v-for="warning in languageWarnings"
          :key="warning.key"
          class="summary-step__warning flex gap-tiny">
          <ph-icon name="warning" size="xs" />
          {{
            $t(`transcription_create.warnings.${warning.key}`, {
              languages: formatLanguages(warning.languages),
            })
          }}
        </small>
        <template #action>
          <LanguagePicker
            :label="$t('transcription_create.summary.language')"
            :value="draft.languages"
            :options="languageOptions"
            :disabled="sending"
            @input="$emit('change-languages', $event)" />
        </template>
      </SummaryRow>

      <SummaryRow
        v-if="isLive"
        :label="$t('transcription_create.summary.translation')">
        <span v-if="draft.translations.length" class="flex gap-tiny wrap">
          <Chip
            v-for="code in draft.translations"
            :key="code"
            primary
            :value="formatLanguage(code)" />
        </span>
        <template v-else>{{
          $t("transcription_create.summary.none")
        }}</template>
        <template #action>
          <LanguagePicker
            v-if="translationOptions.length > 0"
            :label="$t('transcription_create.summary.translation')"
            :value="draft.translations"
            :options="translationOptions"
            :disabled="sending"
            @input="$emit('change', { translations: $event })" />
        </template>
      </SummaryRow>

      <SummaryRow
        v-if="isLive"
        :label="$t('transcription_create.summary.live_engine')"
        :value="profileName"
        :disabled="sending"
        @edit="$emit('edit', 'liveEngine')" />

      <SummaryRow
        v-if="isOffline"
        :label="offlineEngineLabel"
        :value="serviceName"
        :disabled="sending"
        @edit="$emit('edit', 'offlineEngine')" />

      <SummaryRow
        :label="$t('transcription_create.summary.speakers')"
        :disabled="sending"
        @edit="$emit('edit', 'speakers')">
        {{ speakersLabel }}
        <small v-if="speakersNotice" class="summary-step__note">
          {{ $t(`transcription_create.speakers.notices.${speakersNotice}`) }}
        </small>
      </SummaryRow>

      <SummaryRow
        :label="$t('transcription_create.summary.sharing')"
        :value="membersRightLabel"
        :withEdit="!isFolderPrivate"
        :disabled="sending"
        @edit="$emit('edit', 'sharing')" />

      <SummaryRow
        v-if="draft.source === 'file'"
        :label="$t('transcription_create.summary.folder')"
        :withEdit="false">
        <FolderSelector
          :value="draft.folderId"
          :full-width="false"
          :readonly="sending"
          @input="$emit('change', { folderId: $event })" />
      </SummaryRow>

      <SummaryRow
        v-if="draft.source === 'visio' && isLive"
        :label="$t('transcription_create.summary.visio_subtitles')"
        :value="visioSubtitlesLabel"
        :disabled="sending"
        @edit="$emit('edit', 'visioSubtitles')" />
    </dl>

    <div v-if="uploadProgress" class="flex col gap-tiny">
      <label for="transcription-upload-progress">
        {{
          $t("conversation.conversation_creation_loading_multiple", {
            count: uploadProgress.index,
            total: uploadProgress.total,
          })
        }}
      </label>
      <progress
        id="transcription-upload-progress"
        class="summary-step__progress"
        max="100"
        :value="uploadProgress.percent"></progress>
    </div>

    <template #footer-message>
      <SaasRefusalMessage v-if="saasRefusalView" :refusal="saasRefusalView" />
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
        :variant="hasSaasRefusalPurchase ? 'secondary' : 'primary'"
        :icon="sourceIcon"
        :loading="sending"
        :disabled="sending || !isComplete">
        {{ $t(`transcription_create.submit.${draft.source}`) }}
      </Button>
      <SaasRefusalAction
        v-if="saasRefusalView"
        :refusal="saasRefusalView"
        :error-data="saasRefusal" />
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
import { computeLanguageWarnings } from "@/tools/transcriptionCreate/computeLanguageWarnings.js"
import { computeServiceName } from "@/tools/transcriptionCreate/computeServiceName.js"
import { computeTranslationOptions } from "@/tools/transcriptionCreate/computeTranslationOptions.js"
import { formatLanguageList } from "@/tools/transcriptionCreate/formatLanguageList.js"
import { isDraftComplete } from "@/tools/transcriptionCreate/isDraftComplete.js"
import { isLiveRequested } from "@/tools/transcriptionCreate/isLiveRequested.js"
import { isOfflineRequested } from "@/tools/transcriptionCreate/isOfflineRequested.js"

import FolderSelector from "@/components/FolderSelector.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import Chip from "@/components/atoms/Chip.vue"
import SaasRefusalMessage from "@/components-cloud/SaasRefusalMessage.vue"
import SaasRefusalAction from "@/components-cloud/SaasRefusalAction.vue"
import LanguagePicker from "./LanguagePicker.vue"
import SummaryRow from "./SummaryRow.vue"
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "SummaryStep",
  components: {
    FolderSelector,
    NotificationBanner,
    Chip,
    SaasRefusalMessage,
    SaasRefusalAction,
    LanguagePicker,
    SummaryRow,
    TranscriptionCreateFrame,
  },
  props: {
    draft: { type: Object, required: true },
    // Files still to send, for the "file" source
    fileCount: { type: Number, required: true },
    catalog: { type: Object, required: true },
    // { profile, service }, see computeDraftEngines
    engines: { type: Object, required: true },
    // See reconcileDraft
    notices: { type: Array, required: true },
    // See computeSpeakerOptions
    speakerOptions: { type: Array, required: true },
    sourceIcon: { type: String, required: true },
    offlineEngineLabel: { type: String, required: true },
    isFolderPrivate: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
    // { index, total, percent } while files are being sent
    uploadProgress: { type: Object, default: null },
    error: { type: String, default: null },
    // See saasRefusalFormMixin
    saasRefusal: { type: Object, default: null },
    saasRefusalView: { type: Object, default: null },
    hasSaasRefusalPurchase: { type: Boolean, default: false },
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
      return this.draft.source === "file"
        ? this.$tc("conversation.transcription.file_count", this.fileCount, {
            count: this.fileCount,
          })
        : this.$t(`transcription_create.source.${this.draft.source}`)
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
    languageWarnings() {
      return computeLanguageWarnings(this.draft, this.engines)
    },
    profileName() {
      return this.engines.profile?.config?.name ?? this.noEngineLabel
    },
    serviceName() {
      const { service } = this.engines
      return service
        ? computeServiceName(service, this.$i18n.locale)
        : this.noEngineLabel
    },
    noEngineLabel() {
      return this.$t("transcription_create.summary.no_engine")
    },
    speakersLabel() {
      const { mode, collectionId } = this.draft.speakers
      const label = this.$t(`transcription_create.speakers.${mode}.label`)
      const collection = this.catalog.collections.find(
        ({ _id }) => _id === collectionId,
      )
      return collection ? `${label} · ${collection.name}` : label
    },
    speakersNotice() {
      return this.speakerOptions.find(
        (option) => option.name === this.draft.speakers.mode,
      )?.notice
    },
    membersRightLabel() {
      return RIGHTS_LIST(this.$t.bind(this)).find(
        (right) => right.value === this.draft.membersRight,
      )?.txt
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
  padding: var(--small-gap) var(--large-gap);
  font-size: var(--text-sm);
  background: var(--neutral-10);
  border-bottom: var(--border-block);
}

.summary-step__rows {
  margin: 0;
}

.summary-step__note {
  font-weight: normal;
  color: var(--text-secondary);
}

.summary-step__warning {
  font-weight: normal;
  color: var(--warning-text);
}

.summary-step__progress {
  width: 100%;
  accent-color: var(--primary-color);
}
</style>
