<template>
  <fieldset
    @click="handleClick"
    class="flex col selectable service-card"
    :class="{
      'security-disabled': securityDisabled,
      'service-card--compact': compact,
    }"
    :selected="selected"
    :role="compact ? 'option' : 'group'"
    :aria-selected="compact ? selected : undefined"
    :aria-disabled="securityDisabled"
    :id="`service-${value.name}`">
    <!-- -- -- header: icon + name + recommended pill + subtitle + change model -- -- -->
    <div class="service-card__header">
      <span class="service-card__icon">
        <ph-icon name="waveform" weight="fill" size="md" />
      </span>
      <div class="service-card__heading flex1">
        <div class="service-card__title-row">
          <span class="service-card__title">{{ description }}</span>
          <span v-if="recommended" class="service-card__badge">
            {{ $t("conversation.transcription.recommended_badge") }}
          </span>
          <span
            v-if="securityLevelEnabled"
            class="service-card__security"
            :class="`service-card__security--${securityLevelValue}`"
            :title="securityLabel">
            <ph-icon :name="securityIcon" size="xs" />
            {{ securityLabel }}
          </span>
        </div>
        <span v-if="subtitle" class="service-card__subtitle">{{
          subtitle
        }}</span>
        <span v-if="securityDisabled" class="service-card__locked">
          <ph-icon name="lock-simple" size="xs" />
          {{ $t("conversation.transcription.security_not_accessible") }}
        </span>
      </div>
      <Button
        v-if="showChangeModel && !compact"
        variant="secondary"
        size="sm"
        type="button"
        icon="arrows-left-right"
        :label="$t('conversation.transcription.change_model')"
        @click.stop="$emit('change-model')" />
    </div>

    <!-- compact (picker) mode stops at the header -->
    <template v-if="!compact">
      <div class="service-card__grid">
        <!-- -- -- language -- -- -->
        <div class="form-field flex col">
          <label :for="`service-${value.name}-language`">
            {{ $t("conversation.transcription.language_label") }}
          </label>
          <select
            v-model="languageField.value"
            :id="`service-${value.name}-language`">
            <option v-for="lang in computeLanguageList" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>

        <!-- -- -- punctuation -- -- -->
        <div class="form-field flex col">
          <label :for="`service-${value.name}-punctuation`">
            {{ $t("conversation.transcription.punctuation_label") }}
          </label>
          <select
            v-if="isModelWithPunctuation"
            v-model="punctuation.value"
            :id="`service-${value.name}-punctuation`">
            <option value="disabled">
              {{ $t("conversation.transcription.punctuation_disabled") }}
            </option>
            <option
              v-for="punctuationService of value.sub_services.punctuation"
              :key="punctuationService.service_name"
              :value="punctuationService.service_name">
              {{ extractLocales(punctuationService.info) }}
            </option>
          </select>
          <div v-else class="service-card__readonly">
            <span>{{
              $t("conversation.transcription.punctuation_value_whisper")
            }}</span>
            <SwitchInput
              :value="true"
              disabled
              :id="`service-${value.name}-punctuation`" />
          </div>
        </div>

        <!-- -- -- diarization (Oui / Non) -- -- -->
        <div class="form-field flex col">
          <label :id="`service-${value.name}-diarization-label`">
            {{ $t("conversation.transcription.diarization_label") }}
          </label>
          <div
            v-if="!multiTrack && diarizationServiceName"
            role="group"
            :aria-labelledby="`service-${value.name}-diarization-label`">
            <Tabs
              variant="inline"
              :tabs="diarizationTabs"
              :value="diarizationChoice"
              @input="setDiarizationChoice" />
          </div>
          <div v-else class="service-card__readonly">
            <span>{{
              $t("conversation.transcription.diarization_single_track")
            }}</span>
          </div>
        </div>

        <!-- -- -- number of speakers (only when diarization is on) -- -- -->
        <div
          class="form-field flex col"
          v-if="!multiTrack && diarizationChoice === 'yes'">
          <label :for="`service-${value.name}-speakers`">
            {{ $t("conversation.transcription.number_of_speaker_label") }}
          </label>
          <input
            type="number"
            placeholder="auto (experimental)"
            v-model="speakersNumber.value"
            :id="`service-${value.name}-speakers`"
            min="0" />
        </div>
      </div>

      <!-- -- -- speaker identification (collections) -- -- -->
      <div class="form-field flex col service-card__speaker-id" v-if="speakerIdCapable">
        <label>
          {{ $t("conversation.transcription.speaker_identification_label") }}
        </label>
        <span class="speaker-id__help">
          {{ $t("conversation.transcription.speaker_identification_help") }}
        </span>
        <div v-if="speakerIdCollections.loading" class="speaker-id__help">
          {{ $t("conversation.transcription.speaker_identification_loading") }}
        </div>
        <div
          v-else-if="speakerIdCollections.list.length === 0"
          class="speaker-id__empty">
          {{ $t("conversation.transcription.speaker_identification_empty") }}
        </div>
        <div v-else class="flex col gap-xsmall speaker-id__list" role="group">
          <!-- .stop keeps the click from bubbling to the card's @click handler,
               whose select() calls preventDefault() and would cancel the toggle -->
          <label
            v-for="collection of speakerIdCollections.list"
            :key="collection._id"
            class="speaker-id__option"
            :class="{
              'speaker-id__option--selected':
                speakerIdCollections.selected.includes(collection._id),
            }"
            @click.stop>
            <input
              type="checkbox"
              class="speaker-id__checkbox"
              :value="collection._id"
              v-model="speakerIdCollections.selected"
              @click.stop
              @change="select(null)" />
            <span class="speaker-id__body">
              <span class="speaker-id__title">
                {{ collection.name }}
                <span
                  v-if="collection.type === 'organization'"
                  class="speaker-id__badge">
                  {{
                    $t(
                      "conversation.transcription.speaker_identification_auto_badge",
                    )
                  }}
                </span>
              </span>
              <span v-if="collectionHint(collection)" class="speaker-id__hint">
                {{ collectionHint(collection) }}
              </span>
            </span>
          </label>
        </div>
      </div>
    </template>
  </fieldset>
</template>
<script>
import EMPTY_FIELD from "../const/emptyField"
import ACOUSTIC from "../const/acoustic"
import AUDIO_QUALITY from "../const/audioQuality"
import LabeledValue from "@/components/atoms/LabeledValue.vue"
import Tabs from "@/components/molecules/Tabs.vue"
import generateServiceConfig from "../tools/generateServiceConfig"
import { apiGetVoiceprintCollections } from "@/api/voiceprintCollection"
import { getEnv } from "@/tools/getEnv"
import { SECURITY_LEVEL_ICONS } from "@/const/securityLevels"
import { normalizeSecurityLevel } from "@/tools/filterBySecurityLevel"

export default {
  props: {
    value: {
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiTrack: {
      type: Boolean,
      required: false,
      default: false,
    },
    securityDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Show the "Recommandé" pill in the header.
    recommended: {
      type: Boolean,
      default: false,
    },
    // Show the "Changer de modèle" button (more than one model available).
    showChangeModel: {
      type: Boolean,
      default: false,
    },
    // Render only the header (used by the model picker list).
    compact: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let defaultLang
    try {
      defaultLang = this?.value?.language.split(",")[0]
    } catch (error) {
      defaultLang = this?.value?.language
    }

    return {
      diarization: { ...EMPTY_FIELD, value: "disabled" },
      punctuation: { ...EMPTY_FIELD, value: "disabled" },
      speakersNumber: { ...EMPTY_FIELD, value: "auto" },
      acoustic_value: ACOUSTIC((key) => this.$i18n.t(key)),
      audio_quality_value: AUDIO_QUALITY((key) => this.$i18n.t(key)),
      languageField: {
        ...EMPTY_FIELD,
        value: defaultLang,
      },
      speakerIdCollections: { list: [], selected: [], loading: false },
    }
  },
  mounted() {
    // Emit the current config once so the view (sticky footer summary) has the
    // model display name + summary even before the user touches anything.
    if (!this.compact) this.select(null)
  },
  computed: {
    description() {
      return this.extractLocales(this.value.desc)
    },
    // Capability-derived one-liner under the model name.
    subtitle() {
      const parts = []
      if (this.computeLanguageList.length > 1) {
        parts.push(this.$t("conversation.transcription.model_multilingual"))
      }
      if ((this.value?.sub_services?.diarization || []).length > 0) {
        parts.push(this.$t("conversation.transcription.model_diarization"))
      }
      return parts.join(" · ")
    },
    securityLevelEnabled() {
      return getEnv("VUE_APP_ENABLE_SECURITY_LEVEL") === "true"
    },
    securityLevelValue() {
      return normalizeSecurityLevel(this.value?.security_level)
    },
    securityIcon() {
      return SECURITY_LEVEL_ICONS[this.securityLevelValue] || "shield"
    },
    securityLabel() {
      return this.$t(
        "conversation.security_level_txt." + this.securityLevelValue,
      )
    },
    modelType() {
      return this.value.model_type
    },
    hasBuiltInPunctuation() {
      return ["whisper", "nemo"].includes(this.modelType)
    },
    isModelWithPunctuation() {
      return !this.hasBuiltInPunctuation
    },
    language() {
      return this.value?.language || "*"
    },
    computeLanguageList() {
      return this.value.language.split(",").map((langCode) => {
        return {
          value: langCode,
          label: this.formatLanguage(langCode),
        }
      })
    },
    // The diarization sub-service used for the "Oui" choice.
    diarizationServiceName() {
      const list = this.value?.sub_services?.diarization || []
      return list[0]?.service_name || null
    },
    diarizationChoice() {
      return this.diarization.value !== "disabled" ? "yes" : "no"
    },
    diarizationTabs() {
      return [
        {
          name: "yes",
          label: this.$t("conversation.transcription.diarization_enabled"),
        },
        {
          name: "no",
          label: this.$t("conversation.transcription.diarization_disabled"),
        },
      ]
    },
    // One-line summary surfaced in the sticky footer.
    summaryLabel() {
      const parts = [this.description]
      const langValue = this.hasBuiltInPunctuation
        ? this.languageField.value
        : this.language
      parts.push(this.formatLanguage(langValue))
      parts.push(
        !this.multiTrack && this.diarizationChoice === "yes"
          ? this.$t("conversation.transcription.summary_diarization_on")
          : this.$t("conversation.transcription.summary_diarization_off"),
      )
      return parts.filter(Boolean).join(" · ")
    },
    speakerIdFeatureEnabled() {
      return getEnv("VUE_APP_ENABLE_SPEAKER_IDENTIFICATION") === "true"
    },
    // The diarization sub-service currently selected in the dropdown
    selectedDiarizationService() {
      const list = this.value?.sub_services?.diarization || []
      return list.find((d) => d.service_name === this.diarization.value) || null
    },
    // True when the selected diarization service advertises the speaker
    // identification capability (info.speaker_identification === true)
    speakerIdCapable() {
      return (
        this.speakerIdFeatureEnabled &&
        this.diarization.value !== "disabled" &&
        Boolean(this.selectedDiarizationService?.info?.speaker_identification)
      )
    },
  },
  watch: {
    "diarization.value"() {
      this.onDiarizationChange()
      this.select(null)
    },
    "punctuation.value"() {
      this.select(null)
    },
    "speakersNumber.value"() {
      this.select(null)
    },
    "languageField.value"() {
      this.select(null)
    },
    multiTrack() {
      this.diarization.value = "disabled"
    },
  },
  methods: {
    removeLeadingSlash(str) {
      return str.replace(/^\/+/, "")
    },
    extractLocales(value) {
      const lang = this.$i18n.locale.split("-")[0] || "en"
      return value[lang] || value["en"]
    },
    // Sub-label shown under a collection in the speaker-identification picker.
    collectionHint(collection) {
      if (collection.type === "organization") {
        return this.$t(
          "conversation.transcription.speaker_identification_org_hint",
        )
      }
      return collection.description || ""
    },
    // Oui/Non segmented toggle for diarization.
    setDiarizationChoice(choice) {
      this.diarization.value =
        choice === "yes" ? this.diarizationServiceName || "disabled" : "disabled"
    },
    handleClick(event) {
      if (this.securityDisabled) {
        event?.preventDefault()
        event?.stopPropagation()
        return
      }
      this.select(event)
    },
    select(event) {
      event?.preventDefault()
      this.$emit("select", {
        ...generateServiceConfig(this.value, {
          punctuationValue: this.punctuation.value,
          diarizationValue: this.diarization.value,
          speakersNumberValue: this.speakersNumber.value,
          languageValue: this.hasBuiltInPunctuation
            ? this.languageField.value
            : this.value.language,
          speakerIdentificationCollections: this.speakerIdCapable
            ? this.speakerIdCollections.selected
            : [],
        }),
        // Top-level display extras for the sticky footer (ignored by the API,
        // which only reads .config / .serviceName / .lang / .endpoint).
        displayName: this.description,
        summary: this.summaryLabel,
      })
    },
    // When the diarization choice changes: lazily load the org collections when
    // the chosen service is speaker-id capable, and clear the selection when
    // identification is no longer applicable.
    onDiarizationChange() {
      if (this.speakerIdCapable) {
        if (
          this.speakerIdCollections.list.length === 0 &&
          !this.speakerIdCollections.loading
        ) {
          this.fetchSpeakerIdCollections()
        }
      } else {
        this.speakerIdCollections.selected = []
      }
    },
    async fetchSpeakerIdCollections() {
      const organizationId =
        this.$store.state.organizations.currentOrganizationScope
      if (!organizationId) return
      this.speakerIdCollections.loading = true
      try {
        const collections = await apiGetVoiceprintCollections(organizationId)
        this.speakerIdCollections.list = Array.isArray(collections)
          ? collections
          : []
      } catch (err) {
        this.speakerIdCollections.list = []
      } finally {
        this.speakerIdCollections.loading = false
      }
    },
    formatLanguage(lang) {
      if (lang == "*") {
        return this.$i18n.t("lang.automatic")
      }
      try {
        const languageNames = new Intl.DisplayNames([this.$i18n.locale], {
          type: "language",
        })
        return languageNames
          .of(lang)
          .replace(/^./, (char) => char.toUpperCase())
      } catch (error) {
        return lang
      }
    },
  },
  components: { LabeledValue, Tabs },
}
</script>

<style lang="scss" scoped>
.service-card {
  gap: 1rem;
  padding: 1.25rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  &--compact {
    gap: 0;
    padding: 0.75rem 1rem;
    cursor: pointer;
  }

  // Header
  &__header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  &__icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 8px;
    background: var(--primary-soft);
    color: var(--primary-color);
  }

  &__heading {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__title {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--text-primary);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.5rem;
    border-radius: 10px;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--primary-color);
    background: var(--primary-soft);
  }

  // Confidentiality level chip (shield + label), color rises with sensitivity.
  &__security {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.1rem 0.45rem;
    border-radius: 10px;
    font-size: var(--text-xs);
    font-weight: 600;
    background: var(--neutral-10);
    color: var(--text-secondary);

    &--1 {
      background: var(--warning-soft);
      color: var(--warning-text, var(--warning-color));
    }

    &--2 {
      background: var(--danger-soft);
      color: var(--danger-color);
    }
  }

  &__locked {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: 0.15rem;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--danger-color);
  }

  &__subtitle {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  // Options grid (two columns, collapses to one on narrow widths)
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.25rem;

    .form-field {
      margin: 0;
      gap: 0.35rem;
    }
  }

  &__readonly {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    min-height: 2.25rem;
    padding: 0 0.25rem;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  &__speaker-id {
    margin: 0;
    padding-top: 1rem;
    border-top: 1px solid var(--neutral-20);
  }
}

@container main (max-width: 720px) {
  .service-card__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.speaker-id {
  &__help {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }

  &__empty {
    font-size: 13px;
    color: var(--text-secondary);
    padding: 0.5rem 0.75rem;
    border: 1px dashed var(--neutral-20);
    border-radius: 6px;
  }

  &__list {
    margin-top: 0.25rem;
  }

  &__option {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.625rem;
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
    cursor: pointer;
    transition:
      border-color 0.12s ease,
      background 0.12s ease;

    &:hover {
      border-color: var(--primary-color);
    }

    &--selected {
      border-color: var(--primary-color);
      background: var(--primary-soft);
    }
  }

  &__checkbox {
    margin-top: 0.15rem;
    flex: 0 0 auto;
    cursor: pointer;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
  }

  &__badge {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
    background: var(--neutral-10);
    border-radius: 4px;
    padding: 0.05rem 0.35rem;
  }

  &__hint {
    font-size: 12px;
    color: var(--text-secondary);
  }
}
</style>
