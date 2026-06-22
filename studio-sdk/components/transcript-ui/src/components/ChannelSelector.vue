<script setup lang="ts">
import { computed } from "vue"
import FormInput from "./molecules/FormInput.vue"
import { useI18n } from "../i18n"

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
