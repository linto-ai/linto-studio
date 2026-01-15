const SECURITY_LEVELS = Object.freeze({
  SECURED: "secured",
  SENSITIVE: "sensitive",
  UNSECURED: "unsecured",

  // check if the value is valid (strict - must be one of the enum values)
  checkValue: (level) =>
    level === SECURITY_LEVELS.SECURED ||
    level === SECURITY_LEVELS.SENSITIVE ||
    level === SECURITY_LEVELS.UNSECURED,

  // check if the value is valid or empty (for API validation)
  isValid: (level) => {
    if (level === undefined || level === null || level === "") {
      return true
    }
    return SECURITY_LEVELS.checkValue(level)
  },

  // get the value or default to UNSECURED
  getValueOrDefault: (level) => {
    if (SECURITY_LEVELS.checkValue(level)) {
      return level
    }
    return SECURITY_LEVELS.UNSECURED
  },
})

module.exports = SECURITY_LEVELS
