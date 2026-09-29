<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number
    label: string
    min: number
    max: number
    step?: number
    /** Shown after the current value — the sliders so far are all pixels. */
    unit?: string
    disabled?: boolean
  }>(),
  { step: 1, unit: "px", disabled: false },
)

const emit = defineEmits<{
  "update:modelValue": [value: number]
}>()

function onInput(event: Event): void {
  emit("update:modelValue", Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <!-- The <label> wraps the input, so the text names it without an id to
       thread through. -->
  <label class="range-slider">
    <span class="range-slider__label">
      {{ label }}
      <span class="range-slider__value">{{ modelValue }}{{ unit }}</span>
    </span>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput" />
  </label>
</template>

<style scoped>
.range-slider {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
}

.range-slider__label {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.range-slider__value {
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.range-slider input[type="range"] {
  width: 100%;
  accent-color: var(--color-primary);
}

.range-slider input[type="range"]:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
