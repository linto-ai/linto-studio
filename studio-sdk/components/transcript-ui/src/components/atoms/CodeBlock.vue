<script setup lang="ts">
import CopyButton from "./CopyButton.vue"
import { useI18n } from "../../i18n"

const props = defineProps<{
  code: string
  lang?: string
  streaming?: boolean
}>()

const { t } = useI18n()

function copy() {
  return navigator.clipboard.writeText(props.code)
}
</script>

<template>
  <div class="code-block">
    <CopyButton
      v-if="!streaming"
      class="code-block__copy"
      variant="transparent"
      size="sm"
      :copy-fn="copy"
      :aria-label="t('markdown.copyCode')" />
    <pre><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block {
  position: relative;
}

.code-block__copy {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.code-block:hover .code-block__copy,
.code-block:focus-within .code-block__copy {
  opacity: 1;
}

.code-block pre {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow-x: auto;
  border: 1px solid var(--color-border);
}

.code-block pre code {
  padding: 0;
  background: none;
  font-family: var(--font-family-mono);
  font-size: 0.9em;
}

@media (prefers-reduced-motion: reduce) {
  .code-block__copy {
    transition: none;
  }
}
</style>
