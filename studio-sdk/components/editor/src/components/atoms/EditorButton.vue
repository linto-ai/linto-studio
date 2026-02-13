<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  ariaLabel?: string
}>(), {
  variant: 'secondary',
  size: 'md',
  disabled: false,
})

const slots = useSlots()

const isIconOnly = computed(() => !!slots.icon && !slots.default)

const classes = computed(() => [
  'editor-btn',
  `editor-btn--${props.variant}`,
  `editor-btn--${props.size}`,
  isIconOnly.value && 'editor-btn--icon-only',
])
</script>

<template>
  <button
    type="button"
    :class="classes"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <span v-if="$slots.icon" class="editor-btn__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>

<style scoped>
.editor-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  font-family: var(--font-family);
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
  white-space: nowrap;
}

.editor-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.editor-btn:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

/* Sizes */
.editor-btn--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  height: 28px;
}

.editor-btn--md {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  height: 32px;
}

/* Icon sizing */
.editor-btn--sm .editor-btn__icon {
  display: inline-flex;
  width: 14px;
  height: 14px;
}

.editor-btn--md .editor-btn__icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
}

/* Icon-only: square */
.editor-btn--icon-only.editor-btn--sm {
  width: 28px;
  padding: 0;
}

.editor-btn--icon-only.editor-btn--md {
  width: 32px;
  padding: 0;
}

/* Variants */
.editor-btn--primary {
  color: #fff;
  background-color: var(--color-primary);
}

.editor-btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.editor-btn--secondary {
  color: var(--color-text-secondary);
  background: none;
  border: 1px solid var(--color-border);
}

.editor-btn--secondary:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.editor-btn--ghost {
  color: var(--color-text-secondary);
  background: none;
}

.editor-btn--ghost:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}
</style>
