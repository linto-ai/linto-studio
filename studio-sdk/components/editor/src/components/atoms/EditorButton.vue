<script setup lang="ts">
import { computed, useSlots } from "vue"
import EditorIcon from "./EditorIcon.vue"
import { resolveIcon, ICON_SIZES } from "./icons"

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: string
    iconRight?: string
    variant?: "primary" | "secondary" | "tertiary" | "transparent"
    intent?: "default" | "destructive"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    loading?: boolean
    block?: boolean
    type?: "button" | "submit"
    ariaLabel?: string
  }>(),
  {
    variant: "tertiary",
    intent: "default",
    size: "sm",
    disabled: false,
    loading: false,
    block: false,
    type: "button",
  },
)

const slots = useSlots()

const hasResolvedIcon = computed(() => !!resolveIcon(props.icon))
const hasResolvedIconRight = computed(() => !!resolveIcon(props.iconRight))
const iconSize = computed(() => ICON_SIZES[props.size])

const isDisabled = computed(() => props.disabled || props.loading)
const hasLabel = computed(() => !!props.label || !!slots.default)
const hasLeftIcon = computed(
  () => props.loading || hasResolvedIcon.value || !!slots.icon,
)
const isIconOnly = computed(() => hasLeftIcon.value && !hasLabel.value)

const classes = computed(() => [
  "editor-btn",
  `editor-btn--${props.variant}`,
  `editor-btn--${props.intent}`,
  `editor-btn--${props.size}`,
  isIconOnly.value && "editor-btn--icon-only",
  props.block && "editor-btn--block",
])
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    :aria-label="ariaLabel">
    <EditorIcon v-if="loading" name="spinner" spin :size="iconSize" />
    <EditorIcon v-else-if="hasResolvedIcon" :name="icon!" :size="iconSize" />
    <slot v-else-if="$slots.icon" name="icon" />
    <span v-if="hasLabel" class="editor-btn__label">
      <slot>{{ label }}</slot>
    </span>
    <EditorIcon
      v-if="hasResolvedIconRight"
      :name="iconRight!"
      :size="iconSize" />
    <slot v-else-if="$slots['icon-right']" name="icon-right" />
  </button>
</template>

<style scoped>
.editor-btn {
  /* Default tokens — overridden by variant/intent/size modifiers */
  --btn-bg: transparent;
  --btn-text: var(--color-text-secondary);
  --btn-border-color: var(--color-border);
  --btn-hover-bg: var(--color-surface-hover);
  --btn-hover-text: var(--color-text-primary);
  --btn-padding-y: 0;
  --btn-padding-x: var(--spacing-sm);
  --btn-font-size: var(--font-size-xs);
  --btn-height: 32px;
  --btn-gap: var(--spacing-xs);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--btn-gap);
  box-sizing: border-box;
  height: var(--btn-height);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  font-family: var(--font-family);
  font-size: var(--btn-font-size);
  font-weight: 500;
  line-height: 1;
  color: var(--btn-text);
  background-color: var(--btn-bg);
  border: 1px solid var(--btn-border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color var(--transition-duration),
    color var(--transition-duration),
    border-color var(--transition-duration);
}

.editor-btn:hover:not(:disabled) {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
}

.editor-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.editor-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.editor-btn__label {
  /* //overflow: hidden;
  text-overflow: ellipsis; */
  text-overflow: ellipsis;
  text-box: cap alphabetic;
}

/* Sizes */
.editor-btn--sm {
  /* defaults */
}

.editor-btn--md {
  --btn-padding-y: 0;
  --btn-padding-x: var(--spacing-md);
  --btn-font-size: var(--font-size-sm);
  --btn-height: 40px;
}

.editor-btn--lg {
  --btn-padding-y: 0;
  --btn-padding-x: var(--spacing-md);
  --btn-font-size: var(--font-size-base);
  --btn-height: 44px;
}

/* Icon-only: square */
.editor-btn--icon-only {
  width: var(--btn-height);
  padding: 0;
}

.editor-btn--block {
  display: flex;
  width: 100%;
}

/* Variants — default intent */
.editor-btn--primary {
  --btn-bg: var(--color-primary);
  --btn-text: var(--color-white);
  --btn-border-color: var(--color-primary);
  --btn-hover-bg: var(--color-primary-hover);
  --btn-hover-text: var(--color-white);
}

.editor-btn--secondary {
  --btn-bg: transparent;
  --btn-text: var(--color-primary);
  --btn-border-color: var(--color-primary);
  --btn-hover-bg: var(--color-primary);
  --btn-hover-text: var(--color-white);
}

.editor-btn--tertiary {
  --btn-bg: transparent;
  --btn-text: var(--color-text-primary);
  --btn-border-color: var(--color-border);
  --btn-hover-bg: var(--color-surface-hover);
  --btn-hover-text: var(--color-text-primary);
}

.editor-btn--transparent {
  --btn-bg: transparent;
  --btn-text: var(--color-text-secondary);
  --btn-border-color: transparent;
  --btn-hover-bg: var(--color-surface-hover);
  --btn-hover-text: var(--color-text-primary);
}

/* Destructive intent overrides */
.editor-btn--destructive.editor-btn--primary {
  --btn-bg: var(--color-danger);
  --btn-text: var(--color-white);
  --btn-border-color: var(--color-danger);
  --btn-hover-bg: var(--color-danger-hover);
  --btn-hover-text: var(--color-white);
}

.editor-btn--destructive.editor-btn--secondary {
  --btn-bg: transparent;
  --btn-text: var(--color-danger);
  --btn-border-color: var(--color-danger);
  --btn-hover-bg: var(--color-danger);
  --btn-hover-text: var(--color-white);
}

.editor-btn--destructive.editor-btn--tertiary,
.editor-btn--destructive.editor-btn--transparent {
  --btn-text: var(--color-danger);
  --btn-hover-bg: var(--color-danger-soft);
  --btn-hover-text: var(--color-danger);
}
</style>
