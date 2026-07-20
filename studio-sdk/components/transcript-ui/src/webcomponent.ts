import { defineCustomElement } from "vue"
import WebComponent from "./WebComponent.vue"
import fontsStyles from "./styles/fonts.css?inline"
// Classic Prism theme for code-block highlighting. Pulled as a string so it can
// be injected into the Shadow DOM (global CSS doesn't cross the boundary).
import prismTheme from "prismjs/themes/prism.css?inline"

// Components rendered outside the SFC tree (popovers, dialogs) don't get
// their scoped styles injected into the Shadow DOM automatically. Collect
// them manually and append them to the SFC's `styles` array.
import SpeakerLabel from "./components/SpeakerLabel.vue"
import SpeakerPopover from "./components/molecules/SpeakerPopover.vue"
import FormInput from "./components/molecules/FormInput.vue"
import SpeakerIndicator from "./components/atoms/SpeakerIndicator.vue"
import Badge from "./components/atoms/Badge.vue"
import Button from "./components/atoms/Button.vue"

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
export { createLivePlugin } from "./plugins/live"
export { createAudioPlugin } from "./plugins/audio"
export type { AudioPluginOptions } from "./plugins/audio"
export { createSubtitlePlugin } from "./plugins/subtitle"
export { createLLMServicesPlugin } from "./plugins/llmServices"
export { createChatPlugin } from "./plugins/chat"
