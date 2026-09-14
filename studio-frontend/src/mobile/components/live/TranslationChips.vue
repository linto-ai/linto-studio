<template>
  <div
    class="m-chips"
    role="group"
    :aria-label="$t('mobile.live.translations')">
    <button
      type="button"
      class="m-chips__chip"
      :class="{ 'm-chips__chip--on': value.length === 0 }"
      :aria-pressed="value.length === 0 ? 'true' : 'false'"
      @click="$emit('input', [])">
      {{ $t("mobile.live.no_translation") }}
    </button>
    <button
      v-for="option in options"
      :key="option.code"
      type="button"
      class="m-chips__chip"
      :class="{ 'm-chips__chip--on': value.includes(option.code) }"
      :aria-pressed="value.includes(option.code) ? 'true' : 'false'"
      @click="toggle(option.code)">
      <PhIcon
        v-if="value.includes(option.code)"
        name="check"
        size="xs"
        weight="bold" />
      {{ option.label }}
    </button>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Multi-select of translation targets. v-model on an array of codes.
export default {
  name: "TranslationChips",
  components: { PhIcon },
  props: {
    value: { type: Array, required: true },
    options: { type: Array, required: true },
  },
  methods: {
    toggle(code) {
      const next = this.value.includes(code)
        ? this.value.filter((item) => item !== code)
        : [...this.value, code]
      this.$emit("input", next)
    },
  },
}
</script>

<style scoped>
.m-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-2);
}

.m-chips__chip {
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

.m-chips__chip--on {
  border-color: var(--m-primary);
  background: var(--m-primary-soft);
  color: var(--m-primary);
  font-weight: 600;
}
</style>
