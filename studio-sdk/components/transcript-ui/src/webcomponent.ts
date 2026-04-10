import { defineCustomElement, ref, h, watch } from "vue"
import Layout from "./components/Layout.vue"
import { createCore, provideCore } from "./core"

import { provideI18n, type Locale } from "./i18n"
import fontsStyles from "./styles/fonts.css?inline"
import styles from "./styles/variables.css?inline"
import baseStyles from "./styles/base.css?inline"
import selectStyles from "./styles/sidebar-select.css?inline"

const LintoEditor = defineCustomElement({
  props: {
    locale: { type: String, default: "fr" },
    noHeader: { type: Boolean, default: false },
  },
  styles: [styles, baseStyles, selectStyles],
  setup(props, { expose }) {
    const locale = ref<Locale>(props.locale as Locale)
    provideI18n(locale)

    watch(
      () => props.locale,
      (val) => {
        locale.value = val as Locale
      },
    )

    const core = createCore()
    //core.use(createAudioPlugin())
    provideCore(core)

    expose({ core })

    return () => {
      if (core.channels.size) {
        return h(Layout, { showHeader: !props.noHeader })
      }

      return null
    }
  },
})

function injectFonts(): void {
  const id = "linto-editor-fonts"
  if (document.getElementById(id)) return
  const style = document.createElement("style")
  style.id = id
  style.textContent = fontsStyles
  document.head.appendChild(style)
}

export function register(tagName = "linto-editor") {
  injectFonts()
  customElements.define(tagName, LintoEditor)
}

export { LintoEditor }
export { createLivePlugin } from "./plugins/live"
export { createAudioPlugin } from "./plugins/audio"
export { createSubtitlePlugin } from "./plugins/subtitle"
export { createTranscriptionEditorPlugin } from "./plugins/transcriptionEditor"
