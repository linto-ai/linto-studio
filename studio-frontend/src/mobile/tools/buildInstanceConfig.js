/**
 * The runtime configuration (window.VUE_APP_CONFIG keys) that points the
 * front at an instance's API: the API URL alone, every other one is derived
 * from it (src/const/apiEndpoints.js).
 * @param {string} base - where the API lives ("https://studio.linto.ai/cm-api")
 * @returns {Object<string, string>}
 */
export function buildInstanceConfig(base) {
  const url = new URL(base)
  const path = url.pathname.replace(/\/+$/, "")
  return {
    VUE_APP_CONVO_API: `${url.origin}${path}/api`,
  }
}
