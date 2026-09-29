<template>
  <div class="m-translations">
    <div
      class="m-translations__chips"
      role="group"
      :aria-label="$t('mobile.live.translations')">
      <button
        type="button"
        class="m-translations__chip"
        :class="{ 'm-translations__chip--on': value.length === 0 }"
        :aria-pressed="value.length === 0 ? 'true' : 'false'"
        @click="$emit('input', [])">
        {{ $t("mobile.live.no_translation") }}
      </button>
      <button
        v-for="option in shownChips"
        :key="option.code"
        type="button"
        class="m-translations__chip"
        :class="{ 'm-translations__chip--on': isSelected(option.code) }"
        :aria-pressed="isSelected(option.code) ? 'true' : 'false'"
        @click="toggle(option.code)">
        <PhIcon
          v-if="isSelected(option.code)"
          name="check"
          size="xs"
          weight="bold" />
        {{ option.label }}
      </button>
    </div>
    <label v-if="remaining.length > 0" class="m-translations__more">
      <span>{{ $t("mobile.live.add_translation") }}</span>
      <select :value="''" @change="addFromSelect($event)">
        <option value="" disabled>
          {{ $t("mobile.live.add_translation_placeholder") }}
        </option>
        <option
          v-for="option in remaining"
          :key="option.code"
          :value="option.code">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Translation targets: a few likely ones as chips (suggestions + what is
// already selected), the rest behind a select. v-model on an array of codes.
export default {
  name: "TranslationPicker",
  components: { PhIcon },
  props: {
    value: { type: Array, required: true },
    options: { type: Array, required: true },
    suggestions: { type: Array, default: () => [] },
  },
  computed: {
    shownChips() {
      const codes = new Set(this.suggestions.map((option) => option.code))
      const selectedExtra = this.options.filter(
        (option) => this.value.includes(option.code) && !codes.has(option.code),
      )
      return [...this.suggestions, ...selectedExtra]
    },
    remaining() {
      const shown = new Set(this.shownChips.map((option) => option.code))
      return this.options.filter((option) => !shown.has(option.code))
    },
  },
  methods: {
    isSelected(code) {
      return this.value.includes(code)
    },
    toggle(code) {
      const next = this.isSelected(code)
        ? this.value.filter((item) => item !== code)
        : [...this.value, code]
      this.$emit("input", next)
    },
    addFromSelect(event) {
      const code = event.target.value
      if (code && !this.isSelected(code))
        this.$emit("input", [...this.value, code])
      event.target.value = ""
    },
  },
}
</script>

<style scoped>
.m-translations {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-translations__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-2);
}

.m-translations__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  min-height: 40px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-round);
  background: var(--m-surface);
  font-size: var(--m-font-size-sm);
  font-weight: 500;
}

.m-translations__chip--on {
  border-color: var(--m-primary);
  background: var(--m-primary-soft);
  color: var(--m-primary);
  font-weight: 600;
}

.m-translations__more {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
}

.m-translations__more select {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}
</style>
