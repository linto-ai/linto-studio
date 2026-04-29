<script setup lang="ts">
defineProps<{
  items: { value: string; label: string }[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()
</script>

<template>
  <select
    class="sidebar-select"
    :value="selectedValue"
    :aria-label="ariaLabel"
    @change="emit('update:selectedValue', ($event.target as HTMLSelectElement).value)">
    <option v-for="item in items" :key="item.value" :value="item.value">
      {{ item.label }}
    </option>
  </select>
</template>
