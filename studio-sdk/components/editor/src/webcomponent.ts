import { defineCustomElement, ref, h } from "vue"
import EditorLayout from "./components/EditorLayout.vue"
import { createEditorCore, provideEditorCore } from "./core"
import { createAudioPlugin } from "./plugins/audio"
import { provideI18n, type Locale } from "./i18n"
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

    const editor = createEditorCore()
    editor.use(createAudioPlugin())
    provideEditorCore(editor)

    expose({ editor })

    return () => {
      if (editor.document.value.channels.length ?? 0) {
        return h(EditorLayout, { showHeader: !props.noHeader })
      }

      return null
    }
  },
})

export function register(tagName = "linto-editor") {
  customElements.define(tagName, LintoEditor)
}

export { LintoEditor }
export { createLivePlugin } from "./plugins/live"
export { createAudioPlugin } from "./plugins/audio"
export { createSubtitlePlugin } from "./plugins/subtitle"
