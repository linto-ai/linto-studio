<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue"
import Layout from "./Layout.vue"
import EditorLoadingOverlay from "./EditorLoadingOverlay.vue"
import EditorErrorOverlay from "./EditorErrorOverlay.vue"
import { createCore } from "../core/createCore"
import { provideCore } from "../core/useCore"
import { useEditorReady } from "../composables/useEditorReady"
import { provideI18n, type Locale } from "@linto-ai/transcript-ui-i18n"

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
  <div class="transcript-ui-root">
    <Layout
      v-if="core.channels.size"
      :show-header="!props.noHeader" />
    <EditorErrorOverlay v-if="error" :message="error" />
    <EditorLoadingOverlay v-else-if="isLoading" />
  </div>
</template>

<style lang="css">
/* NOT fonts.css: a @font-face declared inside a shadow root isn't reliably
 * applied by browsers (document.fonts never registers it) — dead weight in
 * the webcomponent bundle specifically, which always runs shadow-DOM'd. The
 * host declares --font-family's actual font at document level instead (see
 * variables.css's token doc). A direct, non-shadow-DOM Vue embedder of this
 * package (no such limitation) can still opt in: `@import
 * "@linto-ai/transcript-ui-ui/styles/fonts.css"` themselves. */
@import "@linto-ai/transcript-ui-ui/styles/variables.css";
@import "@linto-ai/transcript-ui-ui/styles/base.css";
@import "@linto-ai/transcript-ui-ui/styles/popover-list.css";

/* Positioning context for the absolute loading overlay. */
.transcript-ui-root {
  position: relative;
  height: 100%;
}
</style>
