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
})

module.exports = SECURITY_LEVELS
