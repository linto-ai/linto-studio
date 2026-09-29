<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from "vue"
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
    // Hides the Verbatim tab (and the tab bar entirely once that's the only
    // tab left — see TabBar.vue) — a live session has no finished verbatim
    // to show, see SessionLiveNG.vue.
    noVerbatim?: boolean
    // Hides the high-contrast switch. The theme it drives is the host's as
    // much as the editor's — the host follows "theme:change" to darken its
    // own chrome — so an app that has no dark values of its own turns the
    // switch off rather than offering a half-dark screen.
    noThemeToggle?: boolean
  }>(),
  {
    locale: "fr",
    noHeader: false,
    noVerbatim: false,
    noThemeToggle: false,
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

// A host cannot theme the editor from outside: the token declarations sit on
// this very root, which is closer than the custom element, so they win over
// anything set on <linto-editor>. An inline style is the one thing that
// outranks them — hence the brand colour travels through core.primaryColor
// rather than through CSS. The hover shade is derived so the pair stays
// coherent instead of leaving the editor's own blue behind.
const brandStyle = computed(() =>
  core.primaryColor.value
    ? {
        "--color-primary": core.primaryColor.value,
        "--color-primary-hover": `color-mix(in srgb, ${core.primaryColor.value} 85%, #000)`,
      }
    : undefined,
)

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
  <div
    class="transcript-ui-root"
    :data-theme="core.theme.value"
    :style="brandStyle">
    <Layout
      v-if="core.channels.size"
      :show-header="!props.noHeader"
      :show-verbatim="!props.noVerbatim"
      :show-theme-toggle="!props.noThemeToggle" />
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
