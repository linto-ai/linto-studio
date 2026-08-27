<script setup lang="ts">
import { FormInput } from "@linto-ai/transcript-ui-ui"
import { computed } from "vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import { buildTranslationItems } from "../utils/intl"
import type { TranslationInfo } from "../core/types"

const props = defineProps<{
  translations: TranslationInfo[]
  selectedTranslationId: string
}>()

const emit = defineEmits<{
  "update:selectedTranslationId": [id: string]
}>()

const { t, locale } = useI18n()

const options = computed(() =>
  buildTranslationItems(
    props.translations,
    locale.value,
    t("sidebar.originalLanguage"),
    t("language.wildcard"),
    t("sidebar.bilingual"),
  ),
)

const field = computed(() => ({ label: t("sidebar.translationSelectLabel") }))
</script>

<template>
  <FormInput
    select
    :field="field"
    :options="options"
    :model-value="selectedTranslationId"
    @update:model-value="emit('update:selectedTranslationId', $event)" />
</template>
