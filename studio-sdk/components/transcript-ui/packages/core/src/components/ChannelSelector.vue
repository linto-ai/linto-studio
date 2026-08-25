<script setup lang="ts">
import { FormInput } from "@linto/transcript-ui-ui"
import { computed } from "vue"
import { useI18n } from "@linto/transcript-ui-i18n"

const props = defineProps<{
  channels: { id: string; name: string }[]
  selectedChannelId: string
}>()

const emit = defineEmits<{
  "update:selectedChannelId": [id: string]
}>()

const { t } = useI18n()

const options = computed(() =>
  props.channels.map((c) => ({ value: c.id, label: c.name })),
)

const field = computed(() => ({ label: t("sidebar.channelSelectLabel") }))
</script>

<template>
  <FormInput
    select
    :field="field"
    :options="options"
    :model-value="selectedChannelId"
    @update:model-value="emit('update:selectedChannelId', $event)" />
</template>
