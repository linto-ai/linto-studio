<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
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

// Destroy the editor BEFORE Vue tears down the child component tree. Otherwise
// the (still-live) ProseMirror view reconciles node views whose DOM is being
// removed during unmount, throwing "Cannot read properties of null
// (reading 'nextSibling')" on navigation away.
onBeforeUnmount(() => core.destroy())

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
@import "./styles/popover-list.css";
@import "./plugins/transcriptionEditor/cursor.css";
</style>
