import { TRANSCRIPT_UI_TAG_NAME } from "@/const/transcriptUiTagName.js"

let editorModule = null

// The transcript editor web component weighs ~800 kB: fetched the first
// time a page needs <linto-transcript-ui>, never at startup. Resolves to the
// package module (plugins, mapApiTurns) once the element is registered.
export function loadEditor() {
  if (!editorModule) {
    editorModule = import("@linto-ai/transcript-ui-webcomponent").then(
      (module) => {
        module.register(TRANSCRIPT_UI_TAG_NAME)
        return module
      },
    )
  }
  return editorModule
}
