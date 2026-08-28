<script setup lang="ts">
import PopoverList from "../atoms/PopoverList.vue"
import Button from "../atoms/Button.vue"
import { useI18n, type TranslationKey } from "@linto-ai/transcript-ui-i18n"

export interface DownloadFormat {
  format: string
  labelKey: TranslationKey
}

const props = defineProps<{
  formats: DownloadFormat[]
  disabled?: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [format: string]
}>()

const { t } = useI18n()

function onSelect(item: DownloadFormat): void {
  emit("select", item.format)
}
</script>

<template>
  <PopoverList
    :items="props.formats"
    :item-key="(f: DownloadFormat) => f.format"
    align="end"
    @select="onSelect">
    <template #trigger>
      <Button
        variant="primary"
        icon="download"
        icon-right="chevron-down"
        :disabled="disabled"
        :loading="loading">
        {{ t("llmService.download") }}
      </Button>
    </template>
    <template #item="{ item }">
      <span>{{ t(item.labelKey) }}</span>
    </template>
  </PopoverList>
</template>
