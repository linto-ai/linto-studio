let registration = null

// The transcript editor web component weighs ~800 kB: it is fetched the
// first time a page needs <linto-editor>, never at startup.
export function loadEditor() {
  if (!registration) {
    registration = import("@linto-ai/transcript-ui-webcomponent").then(
      (module) => module.register(),
    )
  }
  return registration
}
