import {
  SECURITY_HIERARCHY,
  DEFAULT_SECURITY_LEVEL,
} from "../const/securityLevels.js"

/**
 * Normalizes a security level to its integer form.
 * Invalid values fallback to default (0 - Publicly available).
 *
 * @param {number|string|null|undefined} level - Security level (0, 1, or 2)
 * @returns {number} Normalized integer security level (0, 1, or 2)
 */
export function normalizeSecurityLevel(level) {
  // Convert string to number if needed
  const numLevel = typeof level === "string" ? parseInt(level, 10) : level
  if (typeof numLevel === "number" && SECURITY_HIERARCHY[numLevel] !== undefined) {
    return numLevel
  }
  return DEFAULT_SECURITY_LEVEL
}

/**
 * Filters an array of items based on security level.
 * Items with higher or equal security level pass the filter.
 *
 * @param {Array} items - Array of items to filter
 * @param {number} requiredLevel - Required security level (0, 1, or 2)
 * @param {string} securityKey - Key to read security level from item (default: "security_level")
 * @returns {Array} Filtered items
 */
export function filterBySecurityLevel(
  items,
  requiredLevel,
  securityKey = "security_level",
) {
  const normalizedRequired = normalizeSecurityLevel(requiredLevel)
  const requiredLevelValue = SECURITY_HIERARCHY[normalizedRequired] || 1

  return items.filter((item) => {
    const itemLevel = normalizeSecurityLevel(item[securityKey])
    const itemLevelValue = SECURITY_HIERARCHY[itemLevel] || 1
    return itemLevelValue >= requiredLevelValue
  })
}

/**
 * Filters an array of items based on security level from nested meta object.
 * Used for transcriber profiles where security level is in meta.securityLevel.
 *
 * @param {Array} items - Array of items to filter
 * @param {number} requiredLevel - Required security level (0, 1, or 2)
 * @returns {Array} Filtered items
 */
export function filterByMetaSecurityLevel(items, requiredLevel) {
  const normalizedRequired = normalizeSecurityLevel(requiredLevel)
  const requiredLevelValue = SECURITY_HIERARCHY[normalizedRequired] || 1

  return items.filter((item) => {
    const itemLevel = normalizeSecurityLevel(item.meta?.securityLevel)
    const itemLevelValue = SECURITY_HIERARCHY[itemLevel] || 1
    return itemLevelValue >= requiredLevelValue
  })
}

/**
 * Checks if a single item meets the required security level.
 *
 * @param {Object} item - Item to check
 * @param {number} requiredLevel - Required security level (0, 1, or 2)
 * @param {string} securityKey - Key to read security level from item (default: "security_level")
 * @returns {boolean} True if item meets or exceeds required level
 */
export function meetsSecurityLevel(
  item,
  requiredLevel,
  securityKey = "security_level",
) {
  if (!item) return false
  const normalizedRequired = normalizeSecurityLevel(requiredLevel)
  const requiredLevelValue = SECURITY_HIERARCHY[normalizedRequired] || 1
  const itemLevel = normalizeSecurityLevel(item[securityKey])
  const itemLevelValue = SECURITY_HIERARCHY[itemLevel] || 1
  return itemLevelValue >= requiredLevelValue
}

/**
 * Checks if a single item meets the required security level (using meta.securityLevel).
 *
 * @param {Object} item - Item to check
 * @param {number} requiredLevel - Required security level (0, 1, or 2)
 * @returns {boolean} True if item meets or exceeds required level
 */
export function meetsMetaSecurityLevel(item, requiredLevel) {
  if (!item) return false
  const normalizedRequired = normalizeSecurityLevel(requiredLevel)
  const requiredLevelValue = SECURITY_HIERARCHY[normalizedRequired] || 1
  const itemLevel = normalizeSecurityLevel(item.meta?.securityLevel)
  const itemLevelValue = SECURITY_HIERARCHY[itemLevel] || 1
  return itemLevelValue >= requiredLevelValue
}

/**
 * Filters LLM services by security level.
 * Each service's flavors are filtered by model.security_level,
 * and services with no remaining flavors are removed.
 *
 * @param {Array} services - Array of LLM services with flavors
 * @param {number|string} requiredLevel - Required security level (0, 1, or 2)
 * @returns {Array} Filtered services with filtered flavors
 */
export function filterLLMServicesBySecurityLevel(services, requiredLevel) {
  const normalizedRequired = normalizeSecurityLevel(requiredLevel)
  const requiredLevelValue = SECURITY_HIERARCHY[normalizedRequired] || 1

  return services
    .map((service) => {
      const filteredFlavors = (service.flavors || []).filter((flavor) => {
        const flavorLevel = normalizeSecurityLevel(flavor.model?.security_level)
        const flavorLevelValue = SECURITY_HIERARCHY[flavorLevel] || 1
        return flavorLevelValue >= requiredLevelValue
      })
      return { ...service, flavors: filteredFlavors }
    })
    .filter((service) => service.flavors.length > 0)
}

export default {
  normalizeSecurityLevel,
  filterBySecurityLevel,
  filterByMetaSecurityLevel,
  meetsSecurityLevel,
  meetsMetaSecurityLevel,
  filterLLMServicesBySecurityLevel,
}
