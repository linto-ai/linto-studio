import { SETTINGS_QUERY_PARAM } from "../const/settingsQueryParam.js"

/**
 * Settings tab requested through the URL, and the query to navigate to once
 * it is consumed (the same one without the settings parameter, so a reload
 * doesn't reopen the modal).
 * @param {Object} query - route query
 * @returns {{ tab: string, query: Object } | null} null when no tab is requested
 */
export function computeSettingsTabRequest(query) {
  const tab = query?.[SETTINGS_QUERY_PARAM]
  if (typeof tab !== "string" || tab === "") return null
  const remainingQuery = { ...query }
  delete remainingQuery[SETTINGS_QUERY_PARAM]
  return { tab, query: remainingQuery }
}
