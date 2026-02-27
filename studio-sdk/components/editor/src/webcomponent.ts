import { defineCustomElement, ref, h } from "vue"
import EditorLayout from "./components/EditorLayout.vue"
import { createEditorCore, provideEditorCore } from "./core"
import { provideI18n, type Locale } from "./i18n"
import styles from "./styles/variables.css?inline"

const LintoEditor = defineCustomElement({
  props: {
    locale: { type: String, default: "fr" },
  },
  styles: [styles],
  setup(props, { expose }) {
    const locale = ref<Locale>(props.locale as Locale)
    provideI18n(locale)

    const editor = createEditorCore()
    provideEditorCore(editor)

    expose({ editor })

    return () => {
      if (editor.document.value.channels.length ?? 0) {
        return h(EditorLayout)
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
