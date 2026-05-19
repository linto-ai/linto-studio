<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from "reka-ui"
import { Check } from "lucide-vue-next"

defineProps<{
  modelValue: boolean
  ariaLabel?: string
}>()

defineEmits<{
  "update:modelValue": [value: boolean]
}>()
</script>

<template>
  <CheckboxRoot
    :model-value="modelValue"
    :aria-label="ariaLabel"
    class="checkbox"
    @update:model-value="$emit('update:modelValue', !!$event)"
    @click.stop>
    <CheckboxIndicator class="checkbox-indicator">
      <Check :size="12" :stroke-width="3" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>

<style scoped>
.checkbox {
  all: unset;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color var(--transition-duration),
    border-color var(--transition-duration);
}

.checkbox:hover {
  border-color: var(--color-primary);
}

.checkbox:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.checkbox[data-state="checked"] {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-indicator {
  color: var(--color-white, #fff);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
