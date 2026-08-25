import { defineCustomElement } from "vue"
import WebComponent from "./WebComponent.vue"
import fontsStyles from "@linto/transcript-ui-ui/styles/fonts.css?inline"
// Classic Prism theme for code-block highlighting. Pulled as a string so it can
// be injected into the Shadow DOM (global CSS doesn't cross the boundary).
import prismTheme from "prismjs/themes/prism.css?inline"

// Components rendered outside the SFC tree (popovers, dialogs) don't get
// their scoped styles injected into the Shadow DOM automatically. Collect
// them manually and append them to the SFC's `styles` array.
import { SpeakerLabel, SpeakerPopover } from "@linto/transcript-ui-core"
import { FormInput, SpeakerIndicator, Badge, Button } from "@linto/transcript-ui-ui"

function getComponentStyles(comp: unknown): string[] {
  return (comp as { styles?: string[] }).styles ?? []
}

const wc = WebComponent as unknown as { styles?: string[] }
wc.styles = [
  ...(wc.styles ?? []),
  prismTheme,
  ...getComponentStyles(SpeakerLabel),
  ...getComponentStyles(SpeakerPopover),
  ...getComponentStyles(FormInput),
  ...getComponentStyles(SpeakerIndicator),
  ...getComponentStyles(Badge),
  ...getComponentStyles(Button),
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

export function register(tagName = "linto-editor") {
  injectFonts()
  customElements.define(tagName, LintoEditor)
}

export { LintoEditor }
export { createLivePlugin } from "@linto/transcript-ui-plugin-live"
export { createAudioPlugin } from "@linto/transcript-ui-plugin-audio"
export type { AudioPluginOptions } from "@linto/transcript-ui-plugin-audio"
export { createSubtitlePlugin } from "@linto/transcript-ui-plugin-subtitle"
export { createTranscriptionEditorPlugin } from "@linto/transcript-ui-plugin-transcription-editor"
export { createLLMServicesPlugin } from "@linto/transcript-ui-plugin-llm-services"
export { createChatPlugin } from "@linto/transcript-ui-plugin-chat"
export { mapApiTurns } from "@linto/transcript-ui-core"
