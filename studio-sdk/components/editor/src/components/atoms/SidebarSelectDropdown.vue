<script setup lang="ts">
import { ChevronDown, Check } from "lucide-vue-next"
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from "reka-ui"

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
  <div class="sidebar-select">
    <SelectRoot
      :model-value="selectedValue"
      @update:model-value="emit('update:selectedValue', $event as string)">
      <SelectTrigger class="sidebar-select-trigger" :aria-label="ariaLabel">
        <SelectValue class="sidebar-select-trigger-label" />
        <SelectIcon>
          <ChevronDown :size="16" />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal disabled>
        <SelectContent
          class="sidebar-select-content"
          position="popper"
          :side-offset="4"
          position-strategy="absolute">
          <SelectViewport>
            <SelectItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
              class="sidebar-select-item">
              <SelectItemIndicator class="sidebar-select-item-indicator">
                <Check :size="14" />
              </SelectItemIndicator>
              <SelectItemText>{{ item.label }}</SelectItemText>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
