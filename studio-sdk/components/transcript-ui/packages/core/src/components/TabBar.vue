<script setup lang="ts">
import { Tabs, type TabItem } from "@linto-ai/transcript-ui-ui"
import { computed } from "vue"
import { TRANSCRIPTION_TAB, VERBATIM_TAB } from "./TabBar.constants"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import { useCore } from "../core"
import { useIsMobile } from "../composables/useIsMobile"

const props = withDefaults(
  defineProps<{
    modelValue: string
    showVerbatim?: boolean
  }>(),
  {
    showVerbatim: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const core = useCore()
const { t } = useI18n()
const { isMobile } = useIsMobile()

// Phone: transcription (and verbatim) stay inline, every AI service folds
// into the "More" menu so the bar never scrolls sideways.
const collapseFrom = computed(() => {
  if (!isMobile.value) return undefined
  return props.showVerbatim ? 2 : 1
})

const tabs = computed<TabItem[]>(() => {
  const services = core.llmServices?.list.value ?? []
  return [
    {
      value: TRANSCRIPTION_TAB,
      label: t("tabs.transcription"),
      icon: "message-circle",
    },
    ...(props.showVerbatim
      ? [
          {
            value: VERBATIM_TAB,
            label: t("tabs.verbatim"),
            icon: "file-text",
          },
        ]
      : []),
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
  <!-- Nothing to switch between with a single tab (e.g. a live session with
       verbatim hidden and no summaries) — no point showing the bar. -->
  <Tabs
    v-if="tabs.length > 1"
    :tabs="tabs"
    :model-value="modelValue"
    :collapse-from="collapseFrom"
    @update:model-value="onSelect" />
</template>
