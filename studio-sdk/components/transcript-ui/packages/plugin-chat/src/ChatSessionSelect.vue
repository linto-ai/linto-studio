<script setup lang="ts">
import { FormInput, type FormField } from "@linto-ai/transcript-ui-ui"
import { computed } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import type { ChatSession } from "@linto-ai/transcript-ui-core"
import { computeSessionOptions } from "./utils/computeSessionOptions"

// Phone counterpart of ChatSessionList: a native select opens the system
// picker, and switching discussions is all a phone needs (renaming and
// deleting stay on larger screens).
const props = defineProps<{
  sessions: ChatSession[]
  activeSessionId: string | null
}>()

const emit = defineEmits<{
  select: [sessionId: string]
}>()

const { t } = useI18n()

const options = computed(() =>
  computeSessionOptions(props.sessions, props.activeSessionId, t("chat.newChat")),
)

const field = computed<FormField>(() => ({
  customParams: { "aria-label": t("chat.history") },
}))

function onChange(sessionId: string): void {
  if (sessionId && sessionId !== props.activeSessionId) emit("select", sessionId)
}
</script>

<template>
  <FormInput
    select
    full-width
    :field="field"
    :options="options"
    :model-value="activeSessionId ?? ''"
    @update:model-value="onChange" />
</template>
