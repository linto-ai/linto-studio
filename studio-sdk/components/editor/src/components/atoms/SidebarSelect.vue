<script setup lang="ts">
import { useIsMobile } from "../../composables/useIsMobile"
import SidebarSelectDropdown from "./SidebarSelectDropdown.vue"
import SidebarSelectSheet from "./SidebarSelectSheet.vue"

defineProps<{
  items: { value: string; label: string }[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()

const { isMobile } = useIsMobile()
</script>

<template>
  <SidebarSelectSheet
    v-if="isMobile"
    v-bind="$props"
    @update:selected-value="emit('update:selectedValue', $event)" />
  <SidebarSelectDropdown
    v-else
    v-bind="$props"
    @update:selected-value="emit('update:selectedValue', $event)" />
</template>
