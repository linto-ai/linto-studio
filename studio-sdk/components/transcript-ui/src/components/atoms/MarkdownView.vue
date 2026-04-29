<script setup lang="ts">
import { computed } from "vue"
import { marked } from "marked"

const props = defineProps<{
  source: string
}>()

const html = computed(() => {
  if (!props.source) return ""
  return marked.parse(props.source, { async: false }) as string
})
</script>

<template>
  <div class="markdown-view" v-html="html" />
</template>

<style scoped>
.markdown-view {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

.markdown-view :deep(h1),
.markdown-view :deep(h2),
.markdown-view :deep(h3),
.markdown-view :deep(h4) {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-weight: 700;
  color: var(--color-text-primary);
}

.markdown-view :deep(h1) {
  font-size: var(--font-size-xl);
}

.markdown-view :deep(h2) {
  font-size: var(--font-size-lg);
}

.markdown-view :deep(h3) {
  font-size: var(--font-size-base);
}

.markdown-view :deep(h4) {
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.markdown-view :deep(p) {
  margin: 0 0 var(--spacing-md);
}

.markdown-view :deep(ul),
.markdown-view :deep(ol) {
  margin: 0 0 var(--spacing-md);
  padding-left: var(--spacing-lg);
}

.markdown-view :deep(li) {
  margin: var(--spacing-xs) 0;
}

.markdown-view :deep(blockquote) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-left: 3px solid var(--color-border);
  color: var(--color-text-secondary);
  font-style: italic;
}

.markdown-view :deep(code) {
  font-family: var(--font-family-mono);
  font-size: 0.9em;
  padding: 1px 4px;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
}

.markdown-view :deep(pre) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.markdown-view :deep(pre code) {
  padding: 0;
  background: none;
}

.markdown-view :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.markdown-view :deep(hr) {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-lg) 0;
}

.markdown-view :deep(strong) {
  font-weight: 700;
}

.markdown-view :deep(table) {
  border-collapse: collapse;
  margin: var(--spacing-md) 0;
}

.markdown-view :deep(th),
.markdown-view :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.markdown-view :deep(th) {
  background-color: var(--color-surface);
  font-weight: 600;
}
</style>
