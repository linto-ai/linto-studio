<template>
  <fieldset
    class="flex col service-card"
    :class="{ 'security-disabled': securityDisabled }"
    :selected="selected"
    role="group"
    :aria-disabled="securityDisabled"
    :id="`service-${value.name}`">
    <!-- -- -- header: shared model header + change-model action -- -- -->
    <div class="service-card__header">
      <ServiceHeader
        :value="value"
        :recommended="recommended"
        :disabled="securityDisabled" />
      <Button
        v-if="showChangeModel"
        variant="secondary"
        size="sm"
        type="button"
        icon="arrows-left-right"
        :label="$t('conversation.transcription.change_model')"
        @click.stop="$emit('change-model')" />
    </div>

    <!-- -- -- row: language + punctuation -- -- -->
    <div class="service-card__row">
      <div
        class="form-field flex col service-card__field service-card__field--language">
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

      <div class="form-field flex col service-card__field">
        <label :for="`service-${value.name}-punctuation`">
          {{ $t("conversation.transcription.punctuation_label") }}
        </label>
        <!-- built-in punctuation: read-only, no control -->
        <div v-if="hasBuiltInPunctuation" class="service-card__locked-value">
          <ph-icon name="lock-simple" size="xs" />
          <span>{{
            $t("conversation.transcription.punctuation_value_whisper")
          }}</span>
        </div>
        <!-- toggleable punctuation: simple on/off, left-aligned with its label -->
        <label v-else class="service-card__check">
          <input
            type="checkbox"
            :id="`service-${value.name}-punctuation`"
            :checked="punctuationEnabled"
            :disabled="!canTogglePunctuation"
            @change="punctuationEnabled = $event.target.checked" />
          <span>{{ $t("conversation.transcription.punctuation_enable") }}</span>
        </label>
      </div>
    </div>

    <!-- -- -- row: diarization + number of speakers -- -- -->
    <div class="service-card__row">
      <div class="form-field flex col service-card__field">
        <label :id="`service-${value.name}-diarization-label`">
          {{ $t("conversation.transcription.diarization_label") }}
        </label>
        <SegmentedControl
          v-if="!multiTrack && diarizationServiceName"
          :value="diarizationChoice"
          :options="diarizationOptions"
          :aria-label="$t('conversation.transcription.diarization_label')"
          @input="setDiarizationChoice" />
        <div v-else class="service-card__locked-value">
          <span>{{
            $t("conversation.transcription.diarization_single_track")
          }}</span>
        </div>
      </div>

      <div
        class="form-field flex col service-card__field"
        v-if="!multiTrack && diarizationChoice === 'yes'">
        <label :id="`service-${value.name}-speakers-label`">
          {{ $t("conversation.transcription.number_of_speaker_label") }}
        </label>
        <div class="service-card__count">
          <SegmentedControl
            :value="speakerCountMode"
            :options="speakerCountOptions"
            :aria-label="
              $t('conversation.transcription.number_of_speaker_label')
            "
            @input="speakerCountMode = $event" />
          <FormInput
            v-if="speakerCountMode === 'fixed'"
            class="service-card__number"
            :field="speakerCountField"
            :input-id="`service-${value.name}-speakers`"
            :value="String(speakerCount)"
            @input="onSpeakerCountInput" />
        </div>
      </div>
    </div>

    <!-- -- -- speaker identification (master switch + collections) -- -- -->
    <div class="service-card__speaker-id" v-if="speakerIdCapable">
      <div class="speaker-id__head">
        <label
          :id="`service-${value.name}-spkid-label`"
          :for="`service-${value.name}-spkid`"
          class="speaker-id__title-label">
          {{ $t("conversation.transcription.speaker_identification_title") }}
        </label>
        <SwitchInput
          :value="speakerIdEnabled"
          :id="`service-${value.name}-spkid`"
          @input="toggleSpeakerId" />
      </div>

      <template v-if="speakerIdEnabled">
        <span class="speaker-id__help">
          {{ $t("conversation.transcription.speaker_identification_help") }}
        </span>
        <div
          v-if="speakerIdCollectionList.length === 0"
          class="speaker-id__empty">
          {{ $t("conversation.transcription.speaker_identification_empty") }}
        </div>
        <div v-else class="flex col gap-small speaker-id__list" role="group">
          <DiarizationCollectionCard
            v-for="collection of sortedSpeakerIdCollectionList"
            :key="collection._id"
            :collection="collection"
            :organizationId="orgScope"
            selectable
            compact
            :showSamples="false"
            :selected="speakerIdSelected.includes(collection._id)"
            @toggle="toggleCollection(collection._id)" />
        </div>
      </template>
    </div>
  </fieldset>
</template>
<script>
import EMPTY_FIELD from "../../const/emptyField"
import ServiceHeader from "./ServiceHeader.vue"
import SegmentedControl from "@/components/molecules/SegmentedControl.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import DiarizationCollectionCard from "@/components/DiarizationCollectionCard.vue"
import generateServiceConfig from "../../tools/generateServiceConfig"
import formatLanguageCode from "@/tools/formatLanguage"
import pickLocale from "@/tools/extractLocales"
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
      languageField: {
        ...EMPTY_FIELD,
        value: defaultLang,
      },
      // Per-service selection of voiceprint collections (the list itself is
      // shared reference data read from the store, see speakerIdCollectionList).
      speakerIdSelected: [],
      // Master toggle for the speaker-identification block.
      speakerIdEnabled: false,
    }
  },
  mounted() {
    // Emit the current config once so the view (sticky footer summary) has the
    // model display name + summary even before the user touches anything.
    this.select()
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
    // Punctuation sub-services advertised by the model (empty for built-in).
    punctuationServices() {
      return this.value?.sub_services?.punctuation || []
    },
    firstPunctuationService() {
      return this.punctuationServices[0]?.service_name || null
    },
    // Can the user turn punctuation on (a sub-service exists to back it).
    canTogglePunctuation() {
      return (
        !this.hasBuiltInPunctuation && Boolean(this.firstPunctuationService)
      )
    },
    // On/off bridge for the punctuation checkbox. Enabling auto-picks the first
    // available punctuation sub-service; disabling clears it.
    punctuationEnabled: {
      get() {
        return this.punctuation.value !== "disabled"
      },
      set(on) {
        this.punctuation.value =
          on && this.firstPunctuationService
            ? this.firstPunctuationService
            : "disabled"
      },
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
    diarizationOptions() {
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
    // Auto / fixed speaker-count toggle.
    speakerCountOptions() {
      return [
        {
          name: "auto",
          label: this.$t("conversation.transcription.speaker_count_auto"),
        },
        {
          name: "fixed",
          label: this.$t("conversation.transcription.speaker_count_fixed"),
        },
      ]
    },
    // FormInput descriptor for the fixed speaker count (no label, min 1).
    speakerCountField() {
      return { type: "number", customParams: { min: 1 } }
    },
    // The current fixed count (defaults to 2 when not set yet).
    speakerCount() {
      const n = parseInt(this.speakersNumber.value, 10)
      return Number.isFinite(n) && n > 0 ? n : 2
    },
    // "auto" when no positive count is set, "fixed" otherwise.
    speakerCountMode: {
      get() {
        const n = parseInt(this.speakersNumber.value, 10)
        return Number.isFinite(n) && n > 0 ? "fixed" : "auto"
      },
      set(mode) {
        this.speakersNumber.value =
          mode === "fixed" ? String(this.speakerCount) : "auto"
      },
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
    // Shared, org-scoped reference data: eagerly loaded into the store on org
    // change. This component is a pure consumer — it never fetches.
    speakerIdCollectionList() {
      return this.$store.getters["organizations/getVoiceprintCollections"]
    },
    // Current organization scope, forwarded to the collection cards so they can
    // load their own speaker/sample stats.
    orgScope() {
      return this.$store.getters["organizations/getCurrentOrganizationScope"]
    },
    // The org-wide collection(s) are applied automatically: surface them first
    // and pre-checked. Usually a single one, but handled as a set.
    organizationCollectionIds() {
      return this.speakerIdCollectionList
        .filter((collection) => collection.type === "organization")
        .map((collection) => collection._id)
    },
    // Organization collections on top, the rest keeping their original order.
    sortedSpeakerIdCollectionList() {
      return [...this.speakerIdCollectionList].sort((a, b) => {
        const aOrg = a.type === "organization" ? 0 : 1
        const bOrg = b.type === "organization" ? 0 : 1
        return aOrg - bOrg
      })
    },
  },
  watch: {
    "diarization.value"() {
      this.onDiarizationChange()
      this.select()
    },
    "punctuation.value"() {
      this.select()
    },
    "speakersNumber.value"() {
      this.select()
    },
    "languageField.value"() {
      this.select()
    },
    multiTrack() {
      this.diarization.value = "disabled"
    },
  },
  methods: {
    extractLocales(value) {
      return pickLocale(value, this.$i18n.locale)
    },
    // Toggle a collection in/out of the per-service selection.
    toggleCollection(collectionId) {
      this.speakerIdSelected = this.speakerIdSelected.includes(collectionId)
        ? this.speakerIdSelected.filter((id) => id !== collectionId)
        : [...this.speakerIdSelected, collectionId]
      this.select()
    },
    // Oui/Non segmented toggle for diarization.
    setDiarizationChoice(choice) {
      this.diarization.value =
        choice === "yes"
          ? this.diarizationServiceName || "disabled"
          : "disabled"
    },
    // FormInput emits the raw value string; clamp it to a positive integer.
    onSpeakerCountInput(value) {
      const n = parseInt(value, 10)
      this.speakersNumber.value = String(
        Number.isFinite(n) ? Math.max(1, n) : 1,
      )
    },
    // Master switch for speaker identification. The collection list is shared
    // reference data already loaded in the store, so there is nothing to fetch
    // here — just toggle and clear the selection on disable.
    toggleSpeakerId(enabled) {
      this.speakerIdEnabled = enabled
      if (!enabled) {
        this.speakerIdSelected = []
      } else if (this.speakerIdSelected.length === 0) {
        // Default to the auto-applied org collection(s), without overriding an
        // existing user selection.
        this.speakerIdSelected = [...this.organizationCollectionIds]
      }
      this.select()
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
          speakerIdentificationCollections:
            this.speakerIdCapable && this.speakerIdEnabled
              ? this.speakerIdSelected
              : [],
        }),
        // Top-level display extras for the sticky footer (ignored by the API,
        // which only reads .config / .serviceName / .lang / .endpoint).
        displayName: this.description,
        summary: this.summaryLabel,
      })
    },
    // When the diarization choice changes and identification is no longer
    // applicable, reset its master switch and selection.
    onDiarizationChange() {
      if (!this.speakerIdCapable) {
        this.speakerIdEnabled = false
        this.speakerIdSelected = []
      }
    },
    formatLanguage(lang) {
      return formatLanguageCode(lang, {
        locale: this.$i18n.locale,
        autoLabel: this.$i18n.t("lang.automatic"),
      })
    },
  },
  components: {
    ServiceHeader,
    SegmentedControl,
    FormInput,
    DiarizationCollectionCard,
  },
}
</script>
<style lang="scss" scoped>
.service-card {
  gap: 1.25rem;
  padding: 1.25rem;
  width: fit-content;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--neutral-30);
  box-shadow: var(--box-shadow-inset);
  background-color: var(--background-inset-section);

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
  }

  // Free-flowing rows: each field keeps its natural width, wraps when needed.
  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem 2rem;
  }

  &__field {
    margin: 0;
    gap: 0.4rem;
    min-width: 0;

    &--language {
      flex: 0 1 240px;

      select {
        width: 100%;
      }
    }
  }

  // Read-only value (built-in punctuation, single-track diarization).
  &__locked-value {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 2.1rem;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  // On/off checkbox aligned left with its label.
  &__check {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.1rem;
    cursor: pointer;
    font-size: var(--text-sm);
    color: var(--text-primary);

    input {
      cursor: pointer;
    }
  }

  &__count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__speaker-id {
    margin: 0;
    padding-top: 1rem;
    border-top: 1px solid var(--neutral-20);
  }
}

// Fixed speaker count: a compact number input (FormInput, no label).
.service-card__number {
  width: 6rem;
}

.speaker-id {
  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  &__title-label {
    font-weight: 600;
    color: var(--text-primary);
  }

  &__help {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0.35rem 0 0.25rem;
  }

  &__empty {
    font-size: 13px;
    color: var(--text-secondary);
    padding: 0.5rem 0.75rem;
    border: 1px dashed var(--neutral-20);
    border-radius: 6px;
  }

  &__list {
    margin-top: 0.5rem;
  }
}
</style>
