/**
 * The runtime configuration (window.VUE_APP_CONFIG keys) that points the
 * front at an instance's API. socket.io reads the path of its URL as a
 * namespace: the origin and the path are given apart.
 * @param {string} base - where the API lives ("https://studio.linto.ai/cm-api")
 * @returns {Object<string, string>}
 */
export function buildInstanceConfig(base) {
  const url = new URL(base)
  const path = url.pathname.replace(/\/+$/, "")
  return {
    VUE_APP_CONVO_API: `${url.origin}${path}/api`,
    VUE_APP_CONVO_AUTH: `${url.origin}${path}/auth`,
    VUE_APP_PUBLIC_MEDIA: `${url.origin}${path}/media`,
    VUE_APP_SESSION_WS: url.origin,
    VUE_APP_SESSION_WS_PATH: `${path}/socket.io`,
  }
}
