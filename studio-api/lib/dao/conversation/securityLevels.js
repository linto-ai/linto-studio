const SECURITY_LEVELS = Object.freeze({
  SECURE: "secure",
  SENSITIVE: "sensitive",
  INSECURE: "insecure",

  // check if the value is valid (strict - must be one of the enum values)
  checkValue: (level) =>
    level === SECURITY_LEVELS.SECURE ||
    level === SECURITY_LEVELS.SENSITIVE ||
    level === SECURITY_LEVELS.INSECURE,

  // check if the value is valid or empty (for API validation)
  isValid: (level) => {
    if (level === undefined || level === null || level === "") {
      return true
    }
    return SECURITY_LEVELS.checkValue(level)
  },

  // get the value or default to INSECURE
  getValueOrDefault: (level) => {
    if (SECURITY_LEVELS.checkValue(level)) {
      return level
    }
    return SECURITY_LEVELS.INSECURE
  },

  /**
   * Check if a service's security level is allowed given the required level
   * Uses hierarchy: secure > sensitive > insecure
   *
   * @param {string|null|undefined} serviceLevel - The security level of the service
   * @param {string|null|undefined} requiredLevel - The required security level
   * @returns {boolean} true if the service should be included
   */
  isAllowed: (serviceLevel, requiredLevel) => {
    // Normalize inputs: undefined/null -> INSECURE
    const normalizedService = SECURITY_LEVELS.getValueOrDefault(serviceLevel)
    const normalizedRequired = SECURITY_LEVELS.getValueOrDefault(requiredLevel)

    // Security hierarchy mapping (higher number = more secure)
    const hierarchy = {
      [SECURITY_LEVELS.INSECURE]: 1,
      [SECURITY_LEVELS.SENSITIVE]: 2,
      [SECURITY_LEVELS.SECURE]: 3,
    }

    // Service level must be >= required level
    return hierarchy[normalizedService] >= hierarchy[normalizedRequired]
  },
})

module.exports = SECURITY_LEVELS
