let editorModule = null

// The transcript editor web component weighs ~800 kB: fetched the first
// time a page needs <linto-editor>, never at startup. Resolves to the
// package module (plugins, mapApiTurns) once the element is registered.
export function loadEditor() {
  if (!editorModule) {
    editorModule = import("@linto-ai/transcript-ui-webcomponent").then(
      (module) => {
        module.register()
        return module
      },
    )
  }
  return editorModule
}
