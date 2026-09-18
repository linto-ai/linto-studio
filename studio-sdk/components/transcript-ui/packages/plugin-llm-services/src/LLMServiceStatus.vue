<script setup lang="ts">
import { computed } from "vue"
import { EditorIcon } from "@linto-ai/transcript-ui-ui"
import { useI18n } from "@linto-ai/transcript-ui-i18n"

const props = defineProps<{
  isUpdated: boolean
}>()

const { t } = useI18n()

const label = computed(() =>
  props.isUpdated
    ? t("llmService.statusUpdated")
    : t("llmService.statusOutdated"),
)
</script>

<template>
  <!-- One line, truncated when short of room: the document toolbar has a
       fixed height, a wrapped label would spill out of it. -->
  <span
    class="llm-service-status"
    :class="
      isUpdated ? 'llm-service-status--ok' : 'llm-service-status--warn'
    "
    :title="label">
    <EditorIcon :name="isUpdated ? 'check' : 'warning'" :size="14" />
    <span class="llm-service-status__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.llm-service-status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.llm-service-status--ok {
  color: var(--color-success, #2e7d32);
}

.llm-service-status--warn {
  color: var(--color-warning, #ed6c02);
}

.llm-service-status :deep(.editor-icon) {
  flex-shrink: 0;
}

.llm-service-status__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
