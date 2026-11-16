/**
 * The API URL in full, as shown in the technical details: VUE_APP_CONVO_API
 * resolved against the page (it may be given as a path).
 * @param {string} apiUrl - VUE_APP_CONVO_API
 * @param {string} pageUrl - the page's URL, for a relative apiUrl
 * @returns {string} e.g. "https://studio.linto.ai/cm-api/api/"
 */
export function resolveApiUrl(apiUrl, pageUrl) {
  return new URL(apiUrl, pageUrl).href
}
