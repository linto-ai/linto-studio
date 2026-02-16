<script setup lang="ts">
import { ChevronDown, Check } from 'lucide-vue-next'
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
} from 'reka-ui'

defineProps<{
  items: { value: string; label: string }[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  'update:selectedValue': [value: string]
}>()
</script>

<template>
  <SelectRoot
    :model-value="selectedValue"
    @update:model-value="emit('update:selectedValue', $event as string)"
  >
    <SelectTrigger
      class="sidebar-select-trigger"
      :aria-label="ariaLabel"
    >
      <SelectValue />
      <SelectIcon>
        <ChevronDown :size="16" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent class="sidebar-select-content" position="popper" :side-offset="4">
        <SelectViewport>
          <SelectItem
            v-for="item in items"
            :key="item.value"
            :value="item.value"
            class="sidebar-select-item"
          >
            <SelectItemIndicator class="sidebar-select-item-indicator">
              <Check :size="14" />
            </SelectItemIndicator>
            <SelectItemText>{{ item.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
.sidebar-select-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  gap: var(--spacing-xs);
  white-space: nowrap;
  font-family: inherit;
  line-height: 1;
}

.sidebar-select-trigger:hover {
  background-color: var(--color-surface-hover);
}

:deep(.sidebar-select-content) {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: var(--reka-select-trigger-width);
  overflow: hidden;
  padding: var(--spacing-xs) 0;
}

:deep(.sidebar-select-item) {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-left: calc(var(--spacing-md) + 20px);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  position: relative;
  user-select: none;
  transition: background-color 150ms;
}

:deep(.sidebar-select-item:hover),
:deep(.sidebar-select-item[data-highlighted]) {
  background-color: var(--color-surface-hover);
  outline: none;
}

:deep(.sidebar-select-item-indicator) {
  position: absolute;
  left: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  color: var(--color-primary);
}
</style>
