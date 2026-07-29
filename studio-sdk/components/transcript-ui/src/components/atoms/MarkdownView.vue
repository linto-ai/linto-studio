<script setup lang="ts">
import { computed } from "vue"
import { renderMarkdownSegments } from "../../utils/markdown"
import CodeBlock from "./CodeBlock.vue"

const props = defineProps<{
  source: string
  streaming?: boolean
}>()

const segments = computed(() => renderMarkdownSegments(props.source))
</script>

<template>
  <div class="markdown-view">
    <template v-for="(seg, i) in segments" :key="i">
      <div
        v-if="seg.type === 'html'"
        class="markdown-view__html"
        v-html="seg.html" />
      <CodeBlock
        v-else
        :code="seg.code"
        :lang="seg.lang"
        :streaming="streaming" />
    </template>
  </div>
</template>

<style scoped>
.markdown-view {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

/* No box: block children flow as direct children of .markdown-view so margin
   collapsing keeps working across html/code segment boundaries. */
.markdown-view__html {
  display: contents;
}

/* Trim the outer margins of the first/last rendered block (reach through the
   display:contents wrapper to the real content element). */
.markdown-view > .markdown-view__html:first-child > :deep(:first-child) {
  margin-top: 0;
}

.markdown-view > .markdown-view__html:last-child > :deep(:last-child) {
  margin-bottom: 0;
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

/* Inline code only — fenced blocks render via <CodeBlock>. Scoped to the html
   wrapper so it never reaches into the CodeBlock component. */
.markdown-view__html :deep(code) {
  font-family: var(--font-family-mono);
  font-size: 0.9em;
  padding: 1px 4px;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
}

/* Fallback for raw <pre> written as literal HTML (not fenced code). */
.markdown-view__html :deep(pre) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow-x: auto;
  border: 1px solid var(--color-border);
}

.markdown-view__html :deep(pre code) {
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
