<script setup lang="ts" generic="T extends string">
import { computed } from "vue"
import EditorIcon from "../atoms/EditorIcon.vue"
import Badge from "../atoms/Badge.vue"
import PopoverList from "../atoms/PopoverList.vue"
import { resolveIcon } from "../atoms/icons"
import { useI18n } from "@linto-ai/transcript-ui-i18n"

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
  // Tabs past this index are folded into one "More" tab with a menu
  // (narrow screens). Undefined: every tab is laid out inline.
  collapseFrom?: number
}>()

const emit = defineEmits<{
  "update:modelValue": [value: T]
}>()

const { t } = useI18n()

const inlineTabs = computed(() =>
  props.collapseFrom === undefined
    ? props.tabs
    : props.tabs.slice(0, props.collapseFrom),
)

const collapsedTabs = computed(() =>
  props.collapseFrom === undefined ? [] : props.tabs.slice(props.collapseFrom),
)

const activeCollapsedTab = computed(
  () =>
    collapsedTabs.value.find((tab) => tab.value === props.modelValue) ?? null,
)

function onSelect(tab: TabItem<T>): void {
  if (tab.disabled) return
  if (tab.value === props.modelValue) return
  emit("update:modelValue", tab.value)
}
</script>

<template>
  <div class="tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in inlineTabs"
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

    <PopoverList
      v-if="collapsedTabs.length > 0"
      :items="collapsedTabs"
      :item-key="(tab: TabItem<T>) => tab.value"
      :is-current="(tab: TabItem<T>) => tab.value === modelValue"
      align="end"
      @select="onSelect">
      <template #trigger>
        <button
          type="button"
          role="tab"
          class="tab tab--more"
          :class="{ 'tab--active': activeCollapsedTab !== null }"
          :aria-selected="activeCollapsedTab !== null"
          :aria-label="t('tabs.moreLabel')">
          <span class="tab__label">{{
            activeCollapsedTab ? activeCollapsedTab.label : t("tabs.moreLabel")
          }}</span>
          <Badge v-if="activeCollapsedTab?.badge" class="tab__badge">{{
            activeCollapsedTab.badge
          }}</Badge>
          <EditorIcon name="chevron-down" :size="14" class="tab__chevron" />
        </button>
      </template>
      <template #item="{ item }">
        <span class="tab__menu-item">
          <EditorIcon
            v-if="resolveIcon(item.icon)"
            :name="item.icon!"
            :size="16" />
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge">{{ item.badge }}</Badge>
        </span>
      </template>
    </PopoverList>
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

.tab__chevron {
  flex-shrink: 0;
  color: currentColor;
}

.tab__menu-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Phone: the inline tabs share the width, labels shrink with an ellipsis,
   icons go, nothing scrolls sideways (the rest lives in the "More" menu). */
@media (max-width: 767px) {
  .tabs {
    padding: 0 var(--spacing-sm);
    overflow-x: hidden;
  }

  .transcript-ui-root .tab {
    flex: 1;
    min-width: 0;
    justify-content: center;
    padding: 0 var(--spacing-xs);
    font-size: var(--font-size-xs);
  }

  .tab__icon {
    display: none;
  }

  .tab__label {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
