<script setup lang="ts">
import { computed } from "vue"
import FormInput from "./molecules/FormInput.vue"
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
