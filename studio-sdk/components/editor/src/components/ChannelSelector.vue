<script setup lang="ts">
import { computed } from 'vue'
import SidebarSelect from './atoms/SidebarSelect.vue'
import { useI18n } from '../i18n'
import type { Channel } from '../types/editor'

const props = defineProps<{
  channels: Channel[]
  selectedChannelId: string
}>()

const emit = defineEmits<{
  'update:selectedChannelId': [id: string]
}>()

const { t } = useI18n()

const items = computed(() =>
  props.channels.map(c => ({ value: c.id, label: c.name }))
)
</script>

<template>
  <SidebarSelect
    :items="items"
    :selected-value="selectedChannelId"
    :ariaLabel="t('header.channelLabel')"
    @update:selected-value="emit('update:selectedChannelId', $event)"
  />
</template>
