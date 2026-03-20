import { defineCustomElement, ref, h } from "vue"
import EditorLayout from "./components/EditorLayout.vue"
import { createEditorStore, provideEditorStore } from "./core"
import { createAudioPlugin } from "./plugins/audio"
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
    console.log(props)
    const locale = ref<Locale>(props.locale as Locale)
    provideI18n(locale)

    const editor = createEditorStore()
    editor.use(createAudioPlugin())
    provideEditorStore(editor)

    expose({ editor })

    return () => {
      if (editor.channels.size) {
        return h(EditorLayout, { showHeader: !props.noHeader })
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
