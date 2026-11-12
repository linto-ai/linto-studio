export const MAX_RECENT_INSTANCES = 3

/**
 * The recently used instances once `instance` is used: it moves first,
 * without duplicate, and the list keeps MAX_RECENT_INSTANCES entries. The
 * default instance is always offered apart, so it is never listed.
 * @param {{ address: string, base: string }[]} recents
 * @param {{ address: string, base: string }} instance
 * @param {string} defaultAddress
 * @returns {{ address: string, base: string }[]}
 */
export function addRecentInstance(recents, instance, defaultAddress) {
  const others = recents.filter((item) => item.address !== instance.address)
  if (instance.address === defaultAddress) return others
  return [instance, ...others].slice(0, MAX_RECENT_INSTANCES)
}
