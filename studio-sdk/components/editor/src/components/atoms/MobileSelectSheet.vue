<script setup lang="ts">
import { ref, computed } from "vue"
import { Check } from "lucide-vue-next"
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  ListboxRoot,
  ListboxContent,
  ListboxItem,
  ListboxItemIndicator,
  ListboxFilter,
} from "reka-ui"
import { useI18n } from "../../i18n"

const props = defineProps<{
  items: { value: string; label: string }[]
  selectedValue: string
  ariaLabel: string
}>()

const emit = defineEmits<{
  "update:selectedValue": [value: string]
}>()

const { t } = useI18n()
const isOpen = ref(false)
const filterThreshold = 7

const selectedLabel = computed(
  () => props.items.find((i) => i.value === props.selectedValue)?.label ?? "",
)

function onSelect(value: string) {
  emit("update:selectedValue", value)
  isOpen.value = false
}
</script>

<template>
  <div class="sidebar-select">
    <button
      class="sidebar-select-trigger"
      :aria-label="ariaLabel"
      @click="isOpen = true">
      <span class="sidebar-select-trigger-label">{{ selectedLabel }}</span>
    </button>

    <DialogRoot v-model:open="isOpen">
      <DialogPortal disabled>
        <DialogOverlay class="sheet-overlay" />
        <DialogContent class="sheet-content" aria-describedby="">
          <DialogTitle class="sr-only">{{ ariaLabel }}</DialogTitle>
          <div class="sheet-handle" />
          <ListboxRoot
            :model-value="selectedValue"
            @update:model-value="onSelect($event as string)">
            <ListboxFilter
              v-if="items.length > filterThreshold"
              class="sheet-filter"
              :placeholder="t('select.filter')" />
            <ListboxContent class="sheet-list">
              <ListboxItem
                v-for="item in items"
                :key="item.value"
                :value="item.value"
                class="sheet-item">
                <ListboxItemIndicator class="sheet-item-indicator">
                  <Check :size="16" />
                </ListboxItemIndicator>
                <span>{{ item.label }}</span>
              </ListboxItem>
            </ListboxContent>
          </ListboxRoot>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>

<!-- Unscoped: styles need to reach DialogContent children -->
<style>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 50;
  animation: overlay-fade-in 200ms ease;
}

.sheet-content {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 50vh;
  z-index: 51;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background-color: var(--color-surface);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  animation: sheet-slide-up 250ms ease;
  display: flex;
  flex-direction: column;
}

.sheet-handle {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background-color: var(--color-border);
  margin: var(--spacing-sm) auto;
  flex-shrink: 0;
}

.sheet-filter {
  position: sticky;
  top: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
  font-size: var(--font-size-sm);
  font-family: inherit;
  color: var(--color-text-primary);
  outline: none;
  width: 100%;
  z-index: 1;
}

.sheet-filter::placeholder {
  color: var(--color-text-muted);
}

.sheet-list {
  overflow-y: auto;
  padding: var(--spacing-xs) 0;
}

.sheet-item {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: var(--spacing-md);
  padding-left: calc(var(--spacing-md) + 24px);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  cursor: pointer;
  position: relative;
  user-select: none;
}

.sheet-item:hover,
.sheet-item[data-highlighted] {
  background-color: var(--color-surface-hover);
  outline: none;
}

.sheet-item-indicator {
  position: absolute;
  left: var(--spacing-md);
  display: inline-flex;
  align-items: center;
  color: var(--color-primary);
}

@keyframes sheet-slide-up {
  from {
    translate: 0 100%;
  }
  to {
    translate: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sheet-overlay,
  .sheet-content {
    animation: none;
  }
}
</style>

<style scoped>
.sidebar-select {
  position: relative;
}

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

.sidebar-select-trigger-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
