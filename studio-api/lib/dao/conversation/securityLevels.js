const SECURITY_LEVELS = Object.freeze({
  PUBLIC: 0,
  COMMISSION: 1,
  SENSITIVE: 2,

  // check if the value is valid (strict - must be one of the enum values)
  checkValue: (level) => [0, 1, 2].includes(level),

  // check if the value is valid or empty (for API validation)
  isValid: (level) => {
    if (level === undefined || level === null || level === "") {
      return true
    }
    return SECURITY_LEVELS.checkValue(level)
  },

  // get the value or default to PUBLIC (0) - invalid values fallback to default
  getValueOrDefault: (level) => {
    if (SECURITY_LEVELS.checkValue(level)) {
      return level
    }
    return SECURITY_LEVELS.PUBLIC
  },

  /**
   * Check if a service's security level is allowed given the required level
   * Uses hierarchy: higher integer = more restricted, service must be >= required
   *
   * @param {number|string|null|undefined} serviceLevel - The security level of the service
   * @param {number|string|null|undefined} requiredLevel - The required security level
   * @returns {boolean} true if the service should be included
   */
  isAllowed: (serviceLevel, requiredLevel) => {
    // Normalize inputs: undefined/null/invalid -> default integer
    const normalizedService = SECURITY_LEVELS.getValueOrDefault(serviceLevel)
    const normalizedRequired = SECURITY_LEVELS.getValueOrDefault(requiredLevel)

    // Security hierarchy mapping (higher number = more restricted)
    const hierarchy = { 0: 1, 1: 2, 2: 3 }

    // Service level must be >= required level
    return hierarchy[normalizedService] >= hierarchy[normalizedRequired]
  },
})

module.exports = SECURITY_LEVELS
