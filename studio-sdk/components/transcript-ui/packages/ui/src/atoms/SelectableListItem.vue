<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Marks the row as selected — sets aria-current and the active style. */
    current?: boolean
    disabled?: boolean
    /** Convenience for a plain text label (or use the default slot). */
    label?: string
    size?: "sm" | "md"
  }>(),
  { size: "md" },
)

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <!-- Row owns the background so the selectable button AND the trailing
       actions share the same hover / selected surface. -->
  <div
    class="selectable-list-item"
    :class="[
      `selectable-list-item--${size}`,
      { 'selectable-list-item--current': current },
    ]">
    <button
      type="button"
      class="selectable-list-item__main"
      :disabled="disabled"
      :aria-current="current ? 'true' : undefined"
      @click="emit('select')">
      <span v-if="$slots.leading" class="selectable-list-item__leading">
        <slot name="leading" />
      </span>
      <span class="selectable-list-item__label">
        <slot>{{ label }}</slot>
      </span>
      <span v-if="$slots.trailing" class="selectable-list-item__trailing">
        <slot name="trailing" />
      </span>
    </button>

    <!-- Absolutely positioned: no flow space taken (label keeps full width),
         revealed on hover / keyboard focus, overlaying the row surface. -->
    <div v-if="$slots.actions" class="selectable-list-item__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.selectable-list-item {
  position: relative;
  display: flex;
  border: 1px solid transparent;
  transition:
    background-color var(--transition-duration),
    box-shadow var(--transition-duration);
}

.selectable-list-item--md {
  font-size: var(--font-size-sm);
}

.selectable-list-item--sm {
  font-size: var(--font-size-xs);
}

.selectable-list-item:hover {
  background-color: var(--color-surface-hover);
}

.selectable-list-item--current,
.selectable-list-item--current:hover {
  background-color: color-mix(in srgb, var(--color-primary) 12%, transparent);
  box-shadow: inset 2px 0 0 var(--color-primary);
}

/* ── The selectable button ── */
.transcript-ui-root .selectable-list-item__main {
  /* Full reset (same convention as Button, EditableText, Tabs…): the
     previous partial reset (background/border/font only) left margin,
     padding, and appearance to whatever the host page's UA/global styles
     happened to set. */
  all: unset;
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font: inherit;
  color: var(--color-text-primary);
  text-align: left;
  cursor: pointer;
}

.transcript-ui-root .selectable-list-item--md .selectable-list-item__main {
  padding: var(--spacing-sm);
}

.transcript-ui-root .selectable-list-item--sm .selectable-list-item__main {
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text-secondary);
}

.transcript-ui-root .selectable-list-item__main:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.transcript-ui-root .selectable-list-item__main:disabled {
  cursor: not-allowed;
}

.transcript-ui-root .selectable-list-item--current .selectable-list-item__main {
  color: var(--color-primary);
  font-weight: 600;
}

.selectable-list-item__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.selectable-list-item__leading,
.selectable-list-item__trailing {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

/* Trailing content (hints, dates) stays muted even on the active row. */
.selectable-list-item__trailing {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* ── Trailing actions (hover / focus reveal, overlaying the row) ── */
.selectable-list-item__actions {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  padding-inline: var(--spacing-md) var(--spacing-xs);
  /* Fade the label out behind the actions, matching the row surface. */
  background: linear-gradient(
    to right,
    transparent,
    var(--color-surface-hover) var(--spacing-md)
  );
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-duration);
}

.selectable-list-item:hover .selectable-list-item__actions,
.selectable-list-item:focus-within .selectable-list-item__actions {
  opacity: 1;
  pointer-events: auto;
}

/* Match the fade to the selected surface on the active row. */
.selectable-list-item--current .selectable-list-item__actions {
  background: linear-gradient(
    to right,
    transparent,
    color-mix(in srgb, var(--color-primary) 12%, var(--color-surface-hover))
      var(--spacing-md)
  );
}

@media (prefers-reduced-motion: reduce) {
  .selectable-list-item,
  .selectable-list-item__actions {
    transition: none;
  }
}
</style>
