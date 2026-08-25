<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
import {
  Layout,
  EditorLoadingOverlay,
  EditorErrorOverlay,
  createCore,
  provideCore,
  useEditorReady,
} from "@linto/transcript-ui-core"
import { provideI18n, type Locale } from "@linto/transcript-ui-i18n"

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

// The editor owns its loading/error overlays: loading stays up until the
// document is loaded and (in collab mode) the first sync lands; error shows
// when the load fails non-recoverably. Embedders don't poll or render either.
const { isLoading, error } = useEditorReady(core)

// Destroy before Vue tears down the child tree, else the live ProseMirror view
// reconciles node views whose DOM is being removed ("nextSibling" null crash).
onBeforeUnmount(() => core.destroy())

defineExpose({ core })
</script>

<template>
  <div class="editor-root">
    <Layout
      v-if="core.channels.size"
      :show-header="!props.noHeader" />
    <EditorErrorOverlay v-if="error" :message="error" />
    <EditorLoadingOverlay v-else-if="isLoading" />
  </div>
</template>

<style lang="css">
@import "@linto/transcript-ui-ui/styles/variables.css";
@import "@linto/transcript-ui-ui/styles/base.css";
@import "@linto/transcript-ui-ui/styles/popover-list.css";

/* Positioning context for the absolute loading overlay. */
.editor-root {
  position: relative;
  height: 100%;
}
</style>
