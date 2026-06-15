<template>
  <!-- TODO: Merge with serviceBox component ? -->
  <fieldset
    @click="handleClick"
    class="flex col selectable"
    :class="{ 'security-disabled': securityDisabled }"
    :selected="selected"
    role="option"
    :aria-selected="selected"
    :aria-disabled="securityDisabled"
    :id="`service-${value.name}`">
    <!-- add a form tag all around ?-->
    <!-- <legend class="h3">{{ value.name }}</legend> -->
    <h4 class="flex align-center service-box__title">
      <!-- <span class="icon apply" v-if="alreadyGenerated"></span> -->
      <span class="flex1">{{ description }}</span>
      <!-- <img class="icon large" :src="icon" :black="disabled" /> -->
    </h4>

    <div class="form-field flex col small-padding-top">
      <!-- <div>
        <label>{{ $t("conversation.acoustic_label") }}</label>
        {{ acoustic_value[value.accoustic] }}
      </div> -->

      <!-- <div>
        <label>{{ $t("conversation.language_label") }}</label>
        {{ language_formatted }}
      </div> -->

      <!-- <div>
        <label>{{ $t("conversation.model_quality_label") }}</label>
        {{ audio_quality_value[value.model_quality] }}
      </div> -->
    </div>

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

    <!-- <LabeledValue
      v-else
      selectLike
      :label="$t('conversation.transcription.language_label')"
      :value="language_formatted"></LabeledValue> -->

    <!-- -- -- punctuation  -- -- -->
    <div class="form-field flex col" v-if="isModelWithPunctuation">
      <label :for="`service-${value.name}-punctuation`">
        {{ $t("conversation.transcription.punctuation_label") }}
      </label>
      <select
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
    </div>
    <LabeledValue
      v-else
      selectLike
      :label="$t('conversation.transcription.punctuation_label')"
      :value="
        $t('conversation.transcription.punctuation_value_whisper')
      "></LabeledValue>

    <!-- -- -- diarization -- -- -->
    <div class="form-field flex col">
      <label :for="`service-${value.name}-diarization`">
        {{ $t("conversation.transcription.diarization_label") }}
      </label>
      <select
        v-model="diarization.value"
        :id="`service-${value.name}-diarization`"
        v-if="!multiTrack">
        <option value="disabled">
          {{ $t("conversation.transcription.diarization_disabled") }}
        </option>
        <option
          v-for="diarizationService of value.sub_services.diarization"
          :key="diarizationService.service_name"
          :value="diarizationService.service_name">
          {{ extractLocales(diarizationService.info) }}
        </option>
      </select>
      <select
        v-model="diarization.value"
        :id="`service-${value.name}-diarization`"
        v-else>
        <option value="disabled">One speaker per file</option>
      </select>
    </div>

    <div class="form-field flex col" v-if="diarization.value !== 'disabled'">
      <label :for="`service-${value.name}-speakers`">
        {{ $t("conversation.transcription.number_of_speaker_label") }}
      </label>
      <input
        type="number"
        :disabled="diarization.value === 'disabled'"
        placeholder="auto (experimental)"
        v-model="speakersNumber.value"
        :id="`service-${value.name}-speakers`"
        min="0" />
    </div>

    <!-- -- -- speaker identification (collections) -- -- -->
    <div class="form-field flex col" v-if="speakerIdCapable">
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
    <div class="flex1"></div>
  </fieldset>
</template>
<script>
import EMPTY_FIELD from "../const/emptyField"
import ACOUSTIC from "../const/acoustic"
import AUDIO_QUALITY from "../const/audioQuality"
import LabeledValue from "@/components/atoms/LabeledValue.vue"
import generateServiceConfig from "../tools/generateServiceConfig"
import { apiGetVoiceprintCollections } from "@/api/voiceprintCollection"
import { getEnv } from "@/tools/getEnv"

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
  computed: {
    description() {
      return this.extractLocales(this.value.desc)
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
      this.$emit(
        "select",
        generateServiceConfig(this.value, {
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
      )
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
        const collections = await apiGetVoiceprintCollections(
          organizationId,
          null,
        )
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
  components: { LabeledValue },
}
</script>

<style lang="scss" scoped>
.speaker-id {
  &__help {
    font-size: 12px;
    color: var(--text-secondary, #5a6472);
    margin-bottom: 0.25rem;
  }

  &__empty {
    font-size: 13px;
    color: var(--text-secondary, #5a6472);
    padding: 0.5rem 0.75rem;
    border: 1px dashed var(--neutral-20, #cfd6dd);
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
    border: 1px solid var(--neutral-20, #cfd6dd);
    border-radius: 6px;
    cursor: pointer;
    transition:
      border-color 0.12s ease,
      background 0.12s ease;

    &:hover {
      border-color: var(--primary-hard, #1976d2);
    }

    &--selected {
      border-color: var(--primary-hard, #1976d2);
      background: var(--primary-soft, #e3f2fd);
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
    color: var(--text-primary, #1a1a1a);
  }

  &__badge {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary, #5a6472);
    background: var(--neutral-10, #eef1f4);
    border-radius: 4px;
    padding: 0.05rem 0.35rem;
  }

  &__hint {
    font-size: 12px;
    color: var(--text-secondary, #5a6472);
  }
}
</style>
