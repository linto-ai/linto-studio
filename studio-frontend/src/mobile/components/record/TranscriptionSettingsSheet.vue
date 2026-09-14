<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.settings.title')"
    @input="$emit('input', $event)">
    <p v-if="services.length === 0" class="m-muted">
      {{ $t("mobile.settings.no_service") }}
    </p>
    <form v-else class="m-settings" @submit.prevent="$emit('input', false)">
      <label v-if="services.length > 1" class="m-settings__field">
        <span>{{ $t("mobile.settings.service") }}</span>
        <select
          :value="choices.serviceName"
          @change="update('serviceName', $event.target.value)">
          <option
            v-for="service in services"
            :key="service.serviceName"
            :value="service.serviceName">
            {{ serviceLabel(service) }}
          </option>
        </select>
      </label>
      <label class="m-settings__field">
        <span>{{ $t("mobile.settings.language") }}</span>
        <select
          :value="choices.language"
          @change="update('language', $event.target.value)">
          <option
            v-for="language in languages"
            :key="language"
            :value="language">
            {{ languageLabel(language) }}
          </option>
        </select>
      </label>
      <label class="m-settings__toggle">
        <span class="m-grow">{{ $t("mobile.settings.diarization") }}</span>
        <input
          type="checkbox"
          :checked="choices.diarization"
          :disabled="!supportsDiarization"
          @change="update('diarization', $event.target.checked)" />
      </label>
      <p v-if="!supportsDiarization" class="m-muted">
        {{ $t("mobile.settings.no_diarization") }}
      </p>
      <button type="submit" class="m-settings__done">
        {{ $t("mobile.common.confirm") }}
      </button>
    </form>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"

// Language, service and speaker separation for the next recordings.
// v-model carries { serviceName, language, diarization }.
export default {
  name: "TranscriptionSettingsSheet",
  components: { BottomSheet },
  props: {
    value: { type: Boolean, default: false },
    services: { type: Array, required: true },
    choices: { type: Object, required: true },
  },
  computed: {
    currentService() {
      return (
        this.services.find(
          (service) => service.serviceName === this.choices.serviceName,
        ) ?? this.services[0]
      )
    },
    languages() {
      return (this.currentService?.language || "*").split(",")
    },
    supportsDiarization() {
      return (this.currentService?.sub_services?.diarization?.length ?? 0) > 0
    },
  },
  methods: {
    update(key, value) {
      this.$emit("change", { ...this.choices, [key]: value })
    },
    serviceLabel(service) {
      return getDescriptionByLanguage(
        service.desc,
        this.$i18n.locale,
        service.serviceName,
      )
    },
    languageLabel(language) {
      return language === "*"
        ? this.$t("lang.automatic")
        : this.$t(`lang.${language.slice(0, 2)}`)
    },
  },
}
</script>

<style scoped>
.m-settings {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-settings__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-settings__field select,
.m-settings__toggle input {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-settings__toggle {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 48px;
}

.m-settings__toggle input {
  width: 24px;
  height: 24px;
  min-height: 0;
  padding: 0;
  accent-color: var(--m-primary);
}

.m-settings__done {
  min-height: 48px;
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
}
</style>
