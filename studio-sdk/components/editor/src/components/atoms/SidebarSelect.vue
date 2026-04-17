<script setup lang="ts" generic="T extends { value: string; label: string }">
import { useIsMobile } from "../../composables/useIsMobile"
import SidebarSelectDropdown from "./SidebarSelectDropdown.vue"
import SidebarSelectSheet from "./SidebarSelectSheet.vue"

defineProps<{
  items: T[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()

defineSlots<{
  item(props: { item: T }): unknown
  trigger(props: { item: T | undefined }): unknown
}>()

const { isMobile } = useIsMobile()
</script>

<template>
  <SidebarSelectSheet
    v-if="isMobile"
    v-bind="$props"
    @update:selected-value="emit('update:selectedValue', $event)">
    <template v-if="$slots.item" #item="{ item }">
      <slot name="item" :item="item" />
    </template>
    <template v-if="$slots.trigger" #trigger="{ item }">
      <slot name="trigger" :item="item" />
    </template>
  </SidebarSelectSheet>
  <SidebarSelectDropdown
    v-else
    v-bind="$props"
    @update:selected-value="emit('update:selectedValue', $event)">
    <template v-if="$slots.item" #item="{ item }">
      <slot name="item" :item="item" />
    </template>
    <template v-if="$slots.trigger" #trigger="{ item }">
      <slot name="trigger" :item="item" />
    </template>
  </SidebarSelectDropdown>
</template>
