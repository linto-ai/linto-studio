/**
 * An instance address as shown to the user: no https://, which goes without
 * saying; http:// stays visible.
 * @param {string} address - a normalized address
 * @returns {string} "studio.linto.ai", "http://10.0.0.2:8001"
 */
export function formatInstanceAddress(address) {
  return address.replace(/^https:\/\//, "")
}
