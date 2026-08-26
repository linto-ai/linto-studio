import { defineCustomElement } from "vue"
import { TranscriptUI, SpeakerLabel, SpeakerPopover } from "@linto/transcript-ui-core"

// Components rendered outside the SFC tree (popovers, dialogs) don't get
// their scoped styles injected into the Shadow DOM automatically. Collect
// them manually and append them to the SFC's `styles` array. Normally
// mounted components (fonts/design tokens via TranscriptUI's own <style>,
// the Prism theme via CodeBlock's) don't need this — Vue injects those
// into the shadow root on its own.
import { FormInput, SpeakerIndicator, Badge, Button } from "@linto/transcript-ui-ui"

function getComponentStyles(comp: unknown): string[] {
  return (comp as { styles?: string[] }).styles ?? []
}

const wc = TranscriptUI as unknown as { styles?: string[] }
wc.styles = [
  ...(wc.styles ?? []),
  ...getComponentStyles(SpeakerLabel),
  ...getComponentStyles(SpeakerPopover),
  ...getComponentStyles(FormInput),
  ...getComponentStyles(SpeakerIndicator),
  ...getComponentStyles(Badge),
  ...getComponentStyles(Button),
]

const LintoEditor = defineCustomElement(TranscriptUI)

export function register(tagName = "linto-editor") {
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
