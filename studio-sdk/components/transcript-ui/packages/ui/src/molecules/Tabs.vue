<script setup lang="ts" generic="T extends string">
import EditorIcon from "../atoms/EditorIcon.vue"
import Badge from "../atoms/Badge.vue"
import { resolveIcon } from "../atoms/icons"

export interface TabItem<V extends string = string> {
  value: V
  label: string
  icon?: string
  badge?: string
  disabled?: boolean
}

const props = defineProps<{
  tabs: TabItem<T>[]
  modelValue: T | null
  ariaLabel?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: T]
}>()

function onSelect(tab: TabItem<T>): void {
  if (tab.disabled) return
  if (tab.value === props.modelValue) return
  emit("update:modelValue", tab.value)
}
</script>

<template>
  <div class="tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      class="tab"
      :class="{ 'tab--active': tab.value === modelValue }"
      :aria-selected="tab.value === modelValue"
      :aria-disabled="tab.disabled || undefined"
      :disabled="tab.disabled"
      @click="onSelect(tab)">
      <EditorIcon
        v-if="resolveIcon(tab.icon)"
        :name="tab.icon!"
        :size="16"
        class="tab__icon" />
      <span class="tab__label">{{ tab.label }}</span>
      <Badge v-if="tab.badge" class="tab__badge">{{ tab.badge }}</Badge>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: stretch;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
  overflow-x: auto;
  scrollbar-width: thin;
}

.transcript-ui-root .tab {
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  height: 44px;
  padding: 0 var(--spacing-sm);
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition:
    color var(--transition-duration),
    border-color var(--transition-duration);
}

.transcript-ui-root .tab:hover:not([disabled]) {
  color: var(--color-text-primary);
}

.transcript-ui-root .tab:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
  border-radius: var(--radius-sm);
}

.transcript-ui-root .tab--active {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-primary);
}

.transcript-ui-root .tab[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.tab__icon {
  flex-shrink: 0;
  color: currentColor;
}

.tab__label {
  text-box: cap alphabetic;
}

.tab__badge {
  margin-left: var(--spacing-xs);
}
</style>
