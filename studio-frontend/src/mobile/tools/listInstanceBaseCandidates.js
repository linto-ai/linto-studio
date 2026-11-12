const API_PREFIX = "/cm-api"

/**
 * Where an instance's API may live, most likely first: the Docker stack
 * serves it under /cm-api, a bare studio-api answers at its root.
 * @param {string} address - a normalized address (normalizeInstanceAddress)
 * @returns {string[]}
 */
export function listInstanceBaseCandidates(address) {
  if (address.endsWith(API_PREFIX)) return [address]
  return [`${address}${API_PREFIX}`, address]
}
