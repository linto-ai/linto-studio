<template>
  <!-- Shared model header: icon + name + recommended pill + confidentiality chip
       + capability subtitle + locked notice. Pure display, derived from `value`.
       Used by both ServiceEditor (hero card) and ServicePickerLine. -->
  <div class="service-header flex1">
    <span class="service-header__icon">
      <ph-icon name="waveform" weight="fill" size="md" />
    </span>
    <div class="service-header__heading flex1">
      <div class="service-header__title-row">
        <span class="service-header__title">{{ description }}</span>
        <span v-if="recommended" class="service-header__badge">
          {{ $t("conversation.transcription.recommended_badge") }}
        </span>
        <span
          v-if="securityLevelEnabled"
          class="service-header__security"
          :class="`service-header__security--${securityLevelValue}`"
          :title="securityLabel">
          <ph-icon :name="securityIcon" size="xs" />
          {{ securityLabel }}
        </span>
      </div>
      <span v-if="subtitle" class="service-header__subtitle">{{
        subtitle
      }}</span>
      <span v-if="disabled" class="service-header__locked">
        <ph-icon name="lock-simple" size="xs" />
        {{ $t("conversation.transcription.security_not_accessible") }}
      </span>
    </div>
  </div>
</template>
<script>
import extractLocales from "@/tools/extractLocales"
import { getEnv } from "@/tools/getEnv"
import { SECURITY_LEVEL_ICONS } from "@/const/securityLevels"
import { normalizeSecurityLevel } from "@/tools/filterBySecurityLevel"

export default {
  props: {
    value: {
      required: true,
    },
    // Show the "Recommandé" pill.
    recommended: {
      type: Boolean,
      default: false,
    },
    // The model does not meet the chosen confidentiality level (locked notice).
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    description() {
      return extractLocales(this.value?.desc, this.$i18n.locale)
    },
    // Capability-derived one-liner under the model name.
    subtitle() {
      const parts = []
      const languageCount = (this.value?.language || "").split(",").length
      if (languageCount > 1) {
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
  },
}
</script>
<style lang="scss" scoped>
.service-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;

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
}
</style>
