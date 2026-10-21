import { getEnv } from "@/tools/getEnv"

/**
 * Reloads the organization usage summary, which carries its live balance.
 * Only the cloud instance counts live minutes: elsewhere, nothing to load.
 * @param {object} store
 * @param {string} organizationId
 * @returns {Promise<object|null>} the usage summary, null outside the cloud
 */
export function refreshLiveCredit(store, organizationId) {
  if (getEnv("VUE_APP_MODE") !== "cloud") return Promise.resolve(null)
  return store.dispatch("billing/fetchUsage", organizationId)
}
