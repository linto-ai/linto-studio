<script setup lang="ts">
import { computed } from "vue"
import SidebarSelect from "./atoms/SidebarSelect.vue"
import { useI18n } from "../i18n"
import { buildTranslationItems } from "../utils/intl"

const props = defineProps<{
  translations: { id: string; languages: string[]; isSource: boolean }[]
  selectedTranslationId: string
}>()

const emit = defineEmits<{
  "update:selectedTranslationId": [id: string]
}>()

const { t, locale } = useI18n()

const items = computed(() =>
  buildTranslationItems(
    props.translations,
    locale.value,
    t("sidebar.originalLanguage"),
    t("language.wildcard"),
  ),
)
</script>

<template>
  <SidebarSelect
    :items="items"
    :selected-value="selectedTranslationId"
    :ariaLabel="t('sidebar.translationLabel')"
    @update:selected-value="emit('update:selectedTranslationId', $event)">
    <template #item="{ item }">
      <span class="translation-row">
        <strong
          v-if="item.originalLabel"
          class="translation-row-badge">{{ item.originalLabel }}</strong>
        <span>{{ item.label }}</span>
      </span>
    </template>
    <template #trigger="{ item }">
      <span
        v-if="item?.originalLabel"
        class="translation-trigger-badge">{{ item.originalLabel }}</span>
      <span>{{ item?.label ?? "" }}</span>
    </template>
  </SidebarSelect>
</template>

<style scoped>
.translation-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.translation-row-badge {
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.translation-trigger-badge {
  font-variant-caps: all-small-caps;
  color: var(--color-text-muted);
  margin-right: var(--spacing-xs);
  letter-spacing: 0.05em;
}
</style>
