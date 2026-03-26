<script setup lang="ts">
defineProps<{
  ariaLabel?: string
}>()
</script>

<template>
  <span class="editor-badge" :aria-label="ariaLabel">
    <slot />
  </span>
</template>

<style scoped>
.editor-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-text-muted);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}
</style>
