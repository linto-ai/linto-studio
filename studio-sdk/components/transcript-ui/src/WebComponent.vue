<script setup lang="ts">
import { ref, watch } from "vue"
import Layout from "./components/Layout.vue"
import { createCore, provideCore } from "./core"
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

const core = createCore()
provideCore(core)

defineExpose({ core })
</script>

<template>
  <Layout
    v-if="core.channels.size"
    :show-header="!props.noHeader" />
</template>

<style lang="css">
@import "./styles/variables.css";
@import "./styles/base.css";
@import "./styles/sidebar-select.css";
@import "./styles/popover-list.css";
@import "./plugins/transcriptionEditor/cursor.css";
</style>
