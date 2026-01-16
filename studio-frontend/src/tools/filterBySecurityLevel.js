const SECURITY_HIERARCHY = {
  insecure: 1,
  sensitive: 2,
  secure: 3,
}

/**
 * Filters an array of items based on security level.
 * Items with higher or equal security level pass the filter.
 *
 * @param {Array} items - Array of items to filter
 * @param {string} requiredLevel - Required security level ("insecure", "sensitive", "secure")
 * @param {string} securityKey - Key to read security level from item (default: "security_level")
 * @returns {Array} Filtered items
 */
export function filterBySecurityLevel(
  items,
  requiredLevel,
  securityKey = "security_level",
) {
  const requiredLevelValue = SECURITY_HIERARCHY[requiredLevel] || 1

  return items.filter((item) => {
    const itemLevel = item[securityKey] || "insecure"
    const itemLevelValue = SECURITY_HIERARCHY[itemLevel] || 1
    return itemLevelValue >= requiredLevelValue
  })
}

/**
 * Filters an array of items based on security level from nested meta object.
 * Used for transcriber profiles where security level is in meta.securityLevel.
 *
 * @param {Array} items - Array of items to filter
 * @param {string} requiredLevel - Required security level ("insecure", "sensitive", "secure")
 * @returns {Array} Filtered items
 */
export function filterByMetaSecurityLevel(items, requiredLevel) {
  const requiredLevelValue = SECURITY_HIERARCHY[requiredLevel] || 1

  return items.filter((item) => {
    const itemLevel = item.meta?.securityLevel || "insecure"
    const itemLevelValue = SECURITY_HIERARCHY[itemLevel] || 1
    return itemLevelValue >= requiredLevelValue
  })
}

export default {
  filterBySecurityLevel,
  filterByMetaSecurityLevel,
}
