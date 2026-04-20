<script setup lang="ts">
import { ref, watch } from "vue"
import EditorLayout from "./components/EditorLayout.vue"
import { createEditorStore, provideEditorStore } from "./core"
import { provideI18n, type Locale } from "./i18n"

const props = withDefaults(
  defineProps<{
    locale?: string
    noHeader?: boolean
  }>(),
  {
    locale: "fr",
    noHeader: false,
  },
)

const locale = ref<Locale>(props.locale as Locale)
provideI18n(locale)

watch(
  () => props.locale,
  (val) => {
    locale.value = val as Locale
  },
)
const editor = createEditorStore()
provideEditorStore(editor)

defineExpose({ editor })
</script>

<template>
  <editor-layout :show-header="!props.noHeader" v-if="editor?.channels?.size">
    <!-- <template #logo>
      <slot name="logo" />
    </template> -->
  </editor-layout>
</template>

<style lang="css">
@import "./styles/variables.css";
@import "./styles/base.css";
@import "./styles/sidebar-select.css";
</style>
