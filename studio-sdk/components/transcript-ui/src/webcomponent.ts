import { defineCustomElement } from "vue"
import WebComponent from "./WebComponent.vue"
import fontsStyles from "./styles/fonts.css?inline"

// Les composants rendus par VueNodeViewRenderer de Tiptap (TurnNodeView)
// et ceux qu'il utilise en descendance n'ont pas leurs styles scopés
// injectés automatiquement dans le Shadow DOM. On les collecte manuellement
// et on les ajoute au tableau `styles` du SFC.
import TurnNodeView from "./plugins/transcriptionEditor/components/TurnNodeView.vue"
import SpeakerLabel from "./components/SpeakerLabel.vue"
import SpeakerIndicator from "./components/atoms/SpeakerIndicator.vue"
import Badge from "./components/atoms/Badge.vue"

function getComponentStyles(comp: unknown): string[] {
  return (comp as { styles?: string[] }).styles ?? []
}

const wc = WebComponent as unknown as { styles?: string[] }
wc.styles = [
  ...(wc.styles ?? []),
  ...getComponentStyles(TurnNodeView),
  ...getComponentStyles(SpeakerLabel),
  ...getComponentStyles(SpeakerIndicator),
  ...getComponentStyles(Badge),
]

const LintoEditor = defineCustomElement(WebComponent)

function injectFonts(): void {
  const id = "linto-editor-fonts"
  if (document.getElementById(id)) return
  const style = document.createElement("style")
  style.id = id
  style.textContent = fontsStyles
  document.head.appendChild(style)
}

// ProseMirror/y-prosemirror appellent `editorView._root.createRange()`
// qui n'existe pas sur ShadowRoot — on délègue à `document`.
function patchShadowRoot(): void {
  if (typeof ShadowRoot === "undefined") return
  const proto = ShadowRoot.prototype as ShadowRoot & {
    createRange?: () => Range
  }
  if (typeof proto.createRange !== "function") {
    proto.createRange = () => document.createRange()
  }
}

export function register(tagName = "linto-editor") {
  injectFonts()
  patchShadowRoot()
  customElements.define(tagName, LintoEditor)
}

export { LintoEditor }
export { createLivePlugin } from "./plugins/live"
export { createAudioPlugin } from "./plugins/audio"
export type { AudioPluginOptions } from "./plugins/audio"
export { createSubtitlePlugin } from "./plugins/subtitle"
export { createTranscriptionEditorPlugin } from "./plugins/transcriptionEditor"
