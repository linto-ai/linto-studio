<script setup lang="ts">
import { useId } from "vue"

defineProps<{
  items: { value: string; label: string }[]
  selectedValue: string
  ariaLabel: string
  label?: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()

const selectId = useId()
</script>

<template>
  <div class="sidebar-select-field">
    <label v-if="label" :for="selectId" class="sidebar-select-label">{{ label }}</label>
    <select
      :id="selectId"
      class="sidebar-select"
      :value="selectedValue"
      :aria-label="label ? undefined : ariaLabel"
      @change="emit('update:selectedValue', ($event.target as HTMLSelectElement).value)">
      <option v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.sidebar-select-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.sidebar-select-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
}
</style>
