<script setup lang="ts">
import { Tabs, type TabItem } from "@linto/transcript-ui-ui"
import { computed } from "vue"
import { TRANSCRIPTION_TAB, VERBATIM_TAB } from "./TabBar.constants"
import { useI18n } from "@linto/transcript-ui-i18n"
import { useCore } from "../core"

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const core = useCore()
const { t } = useI18n()

const tabs = computed<TabItem[]>(() => {
  const services = core.llmServices?.list.value ?? []
  return [
    {
      value: TRANSCRIPTION_TAB,
      label: t("tabs.transcription"),
      icon: "message-circle",
    },
    {
      value: VERBATIM_TAB,
      label: t("tabs.verbatim"),
      icon: "file-text",
    },
    ...services.map<TabItem>((service) => ({
      value: service.id,
      label: service.label.value,
      icon: "sparkles",
      badge: t("tabs.aiBadge"),
    })),
  ]
})

function onSelect(value: string): void {
  if (value !== props.modelValue) emit("update:modelValue", value)
}
</script>

<template>
  <Tabs
    v-if="core.llmServices"
    :tabs="tabs"
    :model-value="modelValue"
    @update:model-value="onSelect" />
</template>
