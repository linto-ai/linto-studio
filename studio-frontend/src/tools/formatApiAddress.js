/**
 * The API address as shown to the user: its root (without the final /api),
 * resolved against the page (the API may be given as a path), without
 * "https://" (http stays visible: a local address) nor trailing slash.
 * @param {string} apiUrl - VUE_APP_CONVO_API
 * @param {string} pageUrl - the page's URL, for a relative apiUrl
 * @returns {string} e.g. "studio.linto.ai/cm-api", "http://10.0.0.5:8001"
 */
export function formatApiAddress(apiUrl, pageUrl) {
  const url = new URL(apiUrl.replace(/\/api\/?$/, ""), pageUrl)
  const scheme = url.protocol === "https:" ? "" : `${url.protocol}//`
  return `${scheme}${url.host}${url.pathname.replace(/\/$/, "")}`
}
